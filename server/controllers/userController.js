import userModel from '../models/users.js';

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body; // destructure req body

    const existingUser = await userModel.findById(userId); // find user

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User not found' });
    } // condition for no user

    return res.status(200).json({
      success: true,
      userData: {
        name: existingUser.name,
        isAccountVerified: existingUser.isAccountVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // fun to get user details
