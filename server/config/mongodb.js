import mongoose from 'mongoose'; // import mongoose

const connectDB = async () => {
  // mongoose.connection.on('connected', () => console.log('Database connected'));
  await mongoose
    .connect(`${process.env.MONGODB_URI}/mern-auth`)
    .then(() => console.log('Database connected'));
}; // function to connect mongodb

export default connectDB;
