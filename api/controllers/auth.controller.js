import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Please provide all fields' });
    return;
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });


  try {
    await newUser.save();
    res.status(201).json('User created successfully')
  } catch (error) {
    next(error);
  }
}