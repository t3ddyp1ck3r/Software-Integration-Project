import { Request, Response } from 'express';
import MovieModel from '../models/movieModel';

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await MovieModel.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching movies' });
  }
};

export const getTopRatedMovies = async (req: Request, res: Response) => {
  try {
    const topMovies = await MovieModel.find().sort({ rating: -1 }).limit(10);
    res.status(200).json(topMovies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching top-rated movies' });
  }
};

export const getSeenMovies = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.session.user._id;
  try {
    const seenMovies = await MovieModel.find({ seenBy: userId });
    res.status(200).json(seenMovies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching seen movies' });
  }
};
