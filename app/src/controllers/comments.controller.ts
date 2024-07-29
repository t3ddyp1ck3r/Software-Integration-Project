import { Request, Response } from 'express';
import CommentModel from '../models/commentModel';

export const getCommentsById = async (req: Request, res: Response) => {
  const { movie_id } = req.params;
  try {
    const comments = await CommentModel.find({ movie_id });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { movie_id } = req.params;
  const { content, author } = req.body;
  try {
    const newComment = new CommentModel({ movie_id, content, author });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
};
