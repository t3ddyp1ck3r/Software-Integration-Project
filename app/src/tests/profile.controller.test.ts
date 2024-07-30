import request from 'supertest';
import { app } from '../index';
import { pool } from '../boot/database/db_connect';

// Mock the pool.query
jest.mock('../boot/database/db_connect', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Profile Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('editPassword', () => {
    it('should update the password successfully', async () => {
      const oldPassword = 'oldPassword';
      const newPassword = 'newPassword';

      // Mock request.user
      const req = {
        user: { email: 'user@example.com' },
        body: { oldPassword, newPassword },
      };

      // Mock the user query
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ email: 'user@example.com', password: oldPassword }], // Simulate the existing user and password
      });
      (pool.query as jest.Mock).mockResolvedValueOnce({}); // Mock the update query

      const res = await request(app)
        .put('/profile/password')
        .set('Cookie', `session=${JSON.stringify({ user: req.user })}`) // Simulate session cookie
        .send(req.body);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Password updated successfully' });
    });

    it('should return 400 if oldPassword or newPassword is missing', async () => {
      const res = await request(app)
        .put('/profile/password')
        .send({ oldPassword: 'oldPassword' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing parameters' });
    });

    it('should return 400 if oldPassword is the same as newPassword', async () => {
      const req = {
        user: { email: 'user@example.com' },
        body: { oldPassword: 'samePassword', newPassword: 'samePassword' },
      };

      const res = await request(app)
        .put('/profile/password')
        .set('Cookie', `session=${JSON.stringify({ user: req.user })}`) // Simulate session cookie
        .send(req.body);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'New password cannot be the same as old password',
      });
    });

    it('should return 400 if old password is incorrect', async () => {
      const req = {
        user: { email: 'user@example.com' },
        body: { oldPassword: 'wrongPassword', newPassword: 'newPassword' },
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // Mock no user found

      const res = await request(app)
        .put('/profile/password')
        .set('Cookie', `session=${JSON.stringify({ user: req.user })}`) // Simulate session cookie
        .send(req.body);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Incorrect old password' });
    });

    it('should handle errors while updating password', async () => {
      const req = {
        user: { email: 'user@example.com' },
        body: { oldPassword: 'oldPassword', newPassword: 'newPassword' },
      };

      (pool.query as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );

      const res = await request(app)
        .put('/profile/password')
        .set('Cookie', `session=${JSON.stringify({ user: req.user })}`) // Simulate session cookie
        .send(req.body);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: 'Exception occurred while updating password',
      });
    });
  });

  describe('logout', () => {
    it('should log out successfully', async () => {
      const req = {
        session: { user: {} },
      };

      const res = await request(app)
        .delete('/profile/logout')
        .set('Cookie', `session=${JSON.stringify(req.session)}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Successfully logged out' });
    });

    it('should return 400 if no active session', async () => {
      const res = await request(app).delete('/profile/logout');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'No active session' });
    });
  });
});
