import bcrypt from 'bcryptjs';
import userModel from '../models/users.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body; // destructure req body

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Incomplete Details' });
  } // condition for incomplete details

  try {
    const existingUser = await userModel.findOne({ email }); // find existing user

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' });
    } // condition for existing user

    const hashedPassword = await bcrypt.hash(password, 10); // create hashed password

    const newUser = new userModel({ name, email, password: hashedPassword }); // create new user
    await newUser.save(); // save new user to database

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    }); // generate jwt token

    res.cookie('token', token, {
      httpOnly: true, // accept only http request
      secure: process.env.NODE_ENV === 'production', // false http, true https
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // is same domain for client and serer
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // generate cookie to send in response

    // generate welcome mail
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Auth Login',
      text: `Welcome to my website. Your account has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions); // sending mail

    return res.status(201).json({ success: true }); // send json response
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // controller for registration

export const login = async (req, res) => {
  const { email, password } = req.body; // destructure req body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and Password are required',
    });
  } // condition for imcomplete detail

  try {
    const user = await userModel.findOne({ email }); // find the user

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email' });
    } // condition for the user

    const isMatch = await bcrypt.compare(password, user.password); // compare password

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid password' });
    } // condition for the password

    // if email and password existed, then user should assigned token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    }); // generate token

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true, // accept http request only
        secure: process.env.NODE_ENV === 'production', // true https, false http
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // is both domain same
        maxAge: 7 * 24 * 60 * 60 * 1000, // expire
      }) // generate cookie and send it to response
      .json({ success: true }); // successful response
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; // controller for login

export const logout = async (req, res) => {
  try {
    res
      .status(204)
      .clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: 'Logged Out' }); // success response
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // controller for logout

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body; // destructure request body

    const existingUser = await userModel.findById(userId); // find user by id

    if (existingUser.isAccountVerified) {
      return res
        .status(409)
        .json({ success: false, message: 'Account is already verified' });
    } // condition for verified account

    const otp = String(Math.floor(Math.random() * 1000000));

    existingUser.verifyOtp = otp; // insert otp
    existingUser.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // insert otp expiry date

    await existingUser.save(); // save to database

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: existingUser.email,
      subject: 'Account Verification OTP',
      text: `Your otp is ${otp}. Verify your account using this otp`,
    }; // create otp verification mail

    await transporter.sendMail(mailOptions); // send the mail

    res
      .status(200)
      .json({ success: true, message: 'Verification OTP send on mail' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // controller for sending verified otp

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body; // destructure user id

  if (!userId || !otp) {
    res.status(400).json({ success: false, message: 'Missing Details' });
  } // condition for incomplete details
  try {
    const existingUser = await userModel.findById(userId); // find user by id

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User is not found' });
    } // condition for exisiting user not available

    if (existingUser.verifyOtp === '' || existingUser.verifyOtp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    } // condition for user otp

    if (existingUser.verifyOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: 'OTP is expired' });
    } // condition for otp expiry

    existingUser.isAccountVerified = true;
    existingUser.verifyOtp = '';
    existingUser.verifyOtpExpireAt = 0;

    await existingUser.save(); // save user to database
    return res
      .status(200)
      .json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // controller for verify Email

export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // controller for checking user authentication

export const sendResetOtp = async (req, res) => {
  const { email } = req.body; // destructur email

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: 'Email is required' });
  } // condition if email not found

  try {
    const existingUser = await userModel.findOne({ email }); // find user

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, messaage: 'User not found' });
    } // condition for no existing user

    const otp = String(Math.ceil(Math.random() * 1000000)); // create otp

    existingUser.resetOtp = otp; // assign reset otp
    existingUser.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // assign reset otp expiry

    await existingUser.save(); // save to database

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for resetting you password is: ${otp}. Please, use this OTP to proceed with resetting your password.`,
    }; // create mail option

    await transporter.sendMail(mailOptions); // send mail

    return res
      .status(200)
      .json({ success: true, message: 'OTP send to your mail' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // controller for password reset otp

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body; // destructre email, otp and new password

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email, OTP and New Password are required',
    });
  } // condition for absent properties

  try {
    const existingUser = await userModel.findOne({ email }); // find user

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    } // condition for user not found

    if (existingUser.resetOtp === '' || existingUser.resetOtp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    } // condition for invalid otp

    if (existingUser.resetOtpExpireAt < Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: 'OTP is expired' });
    } // condition for invalid expiry otp

    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // hashed password

    existingUser.password = hashedNewPassword; // assign new password
    existingUser.resetOtp = ''; // clear reset otp
    existingUser.resetOtpExpireAt = 0; // clear expiry

    await existingUser.save(); // save to database

    return res
      .status(200)
      .json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // controller for resetting password
