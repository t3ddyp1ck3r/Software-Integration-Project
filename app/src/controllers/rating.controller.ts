import { Request, Response } from 'express';
import { pool } from '../boot/database/db_connect';
import { statusCodes } from '../constants/statusCodes';

const addRating = async (req: Request, res: Response): Promise<Response> => {
  const { rating, movieId } = req.body;

  if (!rating || !movieId) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: 'Missing rating or movieId' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO ratings (rating, movie_id) VALUES ($1, $2) RETURNING *;',
      [rating, movieId],
    );
    return res
      .status(statusCodes.success)
      .json({ message: 'Rating added successfully', rating: result.rows[0] });
  } catch (error) {
    console.error('Error while adding rating:', error);
    return res
      .status(statusCodes.queryError)
      .json({ error: 'Exception occurred while adding rating' });
  }
};

const deleteRating = async (req: Request, res: Response): Promise<Response> => {
  const { ratingId } = req.body;

  if (!ratingId) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: 'Missing ratingId' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM ratings WHERE id = $1 RETURNING *;',
      [ratingId],
    );
    if (result.rowCount === 0) {
      return res
        .status(statusCodes.notFound)
        .json({ message: 'Rating not found' });
    }
    return res
      .status(statusCodes.success)
      .json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error while deleting rating:', error);
    return res
      .status(statusCodes.queryError)
      .json({ error: 'Exception occurred while deleting rating' });
  }
};

export { addRating, deleteRating };
