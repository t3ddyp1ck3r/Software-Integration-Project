import { Request, Response } from 'express';
import { pool } from '../boot/database/db_connect';
import { logger } from '../middleware/winston';
import { statusCodes } from '../constants/statusCodes';

export const editPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(statusCodes.badRequest).json({ message: "Missing parameters" });
  }

  if (oldPassword === newPassword) {
    return res.status(statusCodes.badRequest).json({ message: "New password cannot be the same as old password" });
  }

  try {
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = crypt($2, password);",
      [req.user.email, oldPassword]
    );

    if (userQuery.rows.length === 0) {
      return res.status(statusCodes.badRequest).json({ message: "Incorrect old password" });
    }

    await pool.query(
      "UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE email = $2;",
      [newPassword, req.user.email]
    );

    res.status(statusCodes.success).json({ message: "Password updated successfully" });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    res.status(statusCodes.queryError).json({ error: "Exception occurred while updating password" });
  }
};

export const logout = (req: Request, res: Response) => {
  if (req.session?.user) {
    delete req.session.user;
    res.status(200).json({ message: "Successfully logged out" });
  } else {
    res.status(400).json({ message: "No active session" });
  }
};
