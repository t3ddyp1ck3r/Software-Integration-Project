import { Request, Response } from 'express';
import userModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'missing information' });
  }

  const hash = bcrypt.hashSync(password, 10);

  try {
    const User = new userModel({
      email,
      username,
      password: hash,
    });
    const user = await User.save();
    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error while saving user to DB:', error.message);
      return res.status(500).json({ message: 'failed to save user' });
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'unexpected error occurred' });
    }
  }
};

const signin = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'missing information' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Email or password don't match" });
    }

    req.session.user = {
      _id: user._id,
    };

    const token = jwt.sign(
      { user: { id: user._id, email: user.email } },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1h' },
    );

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error while getting user from DB:', error.message);
      return res.status(500).json({ error: 'Failed to get user' });
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'unexpected error occurred' });
    }
  }
};

const getUser = async (req: Request, res: Response): Promise<Response> => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You are not authenticated' });
  }

  try {
    const user = await userModel
      .findById(req.session.user._id, {
        password: 0,
      })
      .populate('messages');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error while getting user from DB:', error.message);
      return res.status(500).json({ error: 'Failed to get user' });
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).json({ error: 'unexpected error occurred' });
    }
  }
};

const logout = (req: Request, res: Response): Response => {
  if (req.session.user) {
    delete req.session.user;
  }

  return res.status(200).json({ message: 'Disconnected' });
};

export { signup, signin, getUser, logout };
