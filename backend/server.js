const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
dotenv.config();

connectDB();

const app = express();

app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://joblyhub.com',
      'https://www.joblyhub.com',
      'https://jobblyhub.netlify.app',
    ],
    credentials: true,
  })
);

// Body parser MUST come before routes and rate limit routes
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    message: 'Too many requests. Please try again later.',
  },
});

// Stricter auth rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: 'Too many login/register attempts. Please try again later.',
  },
});

app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.send('JoblyHub API is running...');
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/job-alerts', require('./routes/jobAlertRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/fraud-reports', require('./routes/fraudReportRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/articles', articleRoutes);
app.use(
    '/api/article-upload',
    require('./routes/articleUploadRoutes')
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`JoblyHub server running on port ${PORT}`);
});