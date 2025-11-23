import express from 'express'; // import express
import cors from 'cors'; // import cors
import 'dotenv/config'; // import dotenv
import cookieParser from 'cookie-parser'; // import cookie parser

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express(); // create app instance
const port = process.env.PORT || 4000; // assign port number
connectDB(); // call function to connect database

const allowedOrigin = ['http://localhost:5173'];

app.use(express.json()); // json parse middleware
app.use(cookieParser()); // cookie parser middleware
app.use(cors({ origin: allowedOrigin, credentials: true })); // cors middleware, allow to send cookies in response

// API Endpoints
app.get('/', (req, res) => {
  res.send('API Working fine');
}); // get route handler
app.use('/api/auth', authRouter); // add authRouter APIs
app.use('/api/user', userRouter); // add userRouter APIs

// server connection
app.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});
