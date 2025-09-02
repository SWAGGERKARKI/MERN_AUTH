import jwt from 'jsonwebtoken'; // import jwt

const userAuth = async (req, res, next) => {
  const { token } = req.cookies; // destructure req cookie

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized. Login Again' });
  } // condition for no token

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET); // decode token

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id; // send id in req body
    } else {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized. Login Again' });
    } // condition for both tokenDecode present and absent

    next(); // control send to controller
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}; // create middleware fun to extract userId from cookie and add it in req body

export default userAuth; // export middleware fun
