import express from 'express'; // import express
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router(); // create router instance

authRouter.post('/register', register); // create post route handler for registration
authRouter.post('/login', login); // create post router handler for login
authRouter.post('/logout', logout); // create post route handler for logout
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp); // route handler for send verify otp
authRouter.post('/verify-email', userAuth, verifyEmail); // route handler for verify email
authRouter.post('/is-auth', userAuth, isAuthenticated); // route handler for check user is authnicated
authRouter.post('/send-reset-otp', sendResetOtp); // route handler for send reset otp
authRouter.post('/reset-password', resetPassword); // route handler for reset password

export default authRouter; // export auth router
