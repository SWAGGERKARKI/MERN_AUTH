import userModel from '../models/users.js';

export const getUserData = async (req, res) => {
  try {
    const { userId } = req; // destructure req body

    const existingUser = await userModel.findById(userId); // find user

    if (!existingUser) {
      return res.json({ success: false, message: 'User not found' });
    } // condition for no user

    return res.json({
      success: true,
      userData: {
        name: existingUser.name,
        isAccountVerified: existingUser.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}; // fun to get user details
