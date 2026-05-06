const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('JoblyHub API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/job-alerts', require('./routes/jobAlertRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`JoblyHub server running on port ${PORT}`);
});