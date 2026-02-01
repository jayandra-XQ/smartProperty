import express from 'express';
import 'dotenv/config'
import mongoose from 'mongoose';


import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';





mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.log(err);
})


const app = express();
app.use(express.json())

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log('server is running on port 3000');
})

