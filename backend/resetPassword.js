const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'fadl_rahman3@yahoo.com';
    const newPassword = '0245909286';

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();

    console.log('Password reset successfully for:', email);
    console.log('New password is:', newPassword);

    process.exit(0);
  } catch (error) {
    console.error('Password reset failed:', error);
    process.exit(1);
  }
};

resetPassword();