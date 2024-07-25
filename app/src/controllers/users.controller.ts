import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hash = bcrypt.hashSync(password, 10);

  try {
    const user = new UserModel({ username, email, password: hash });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.user = { _id: user._id };

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({ error: 'JWT secret key is not defined' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in user' });
  }
};
