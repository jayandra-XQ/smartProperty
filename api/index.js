import express from 'express';
import 'dotenv/config'
import mongoose from 'mongoose';
import userRouter from './routes/user.routes.js';





mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.log(err);
})


const app = express();

app.use('/api/user', userRouter);

app.listen(3000, () => {
  console.log('server is running on port 3000');
})

