import mongoose from 'mongoose'; // import mongoose

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: '' },
  resetOptExpireAt: { type: Number, default: 0 },
}); // create userSchema

const userModel = mongoose.models.user || mongoose.model('user', userSchema); // first search existing one and create userModel

export default userModel;
