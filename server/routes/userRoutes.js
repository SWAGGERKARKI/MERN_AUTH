import express from 'express'; // import express
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router(); // create instance

userRouter.get('/data', userAuth, getUserData); // route handler for getting user data

export default userRouter;
