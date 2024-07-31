import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { app } from '../index';
import userModel from '../models/userModel';

// Mock the userModel
jest.mock('../models/userModel');

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should signup a new user successfully', async () => {
      const mockUser = {
        _id: 'userId',
        username: 'user1',
        email: 'user1@example.com',
      };
      (userModel.prototype.save as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post('/auth/signup').send({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 400 if missing information', async () => {
      const res = await request(app).post('/auth/signup').send({
        username: '',
        email: 'user1@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'missing information' });
    });

    it('should handle errors when saving user', async () => {
      (userModel.prototype.save as jest.Mock).mockRejectedValue(
        new Error('Error while saving user to DB'),
      );

      const res = await request(app).post('/auth/signup').send({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'failed to save user' });
    });
  });

  describe('signin', () => {
    it('should signin a user successfully', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'user1@example.com',
        password: bcrypt.hashSync('password123', 10),
      };
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'user1@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');

      // Optionally verify the token structure
      const decoded = jwt.verify(
        res.body.token,
        process.env.JWT_SECRET_KEY as string,
      );
      expect(decoded).toHaveProperty('user.id', mockUser._id);
      expect(decoded).toHaveProperty('user.email', mockUser.email);
    });

    it('should return 400 if missing information', async () => {
      const res = await request(app)
        .post('/auth/signin')
        .send({ email: '', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'missing information' });
    });

    it('should return 400 if user not found', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'user1@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'User not found' });
    });

    it('should return 400 if password does not match', async () => {
      const mockUser = {
        _id: 'userId',
        email: 'user1@example.com',
        password: bcrypt.hashSync('wrongpassword', 10),
      };
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'user1@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Email or password don't match" });
    });

    it('should handle errors when signing in', async () => {
      (userModel.findOne as jest.Mock).mockRejectedValue(
        new Error('Error while getting user from DB'),
      );

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'user1@example.com', password: 'password123' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to get user' });
    });
  });

  describe('getUser', () => {
    it('should get authenticated user successfully', async () => {
      const mockUser = {
        _id: 'userId',
        username: 'user1',
        email: 'user1@example.com',
        messages: [],
      };
      (userModel.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .get('/auth/user')
        .set(
          'Cookie',
          `session=${JSON.stringify({ user: { _id: 'userId' } })}`,
        );

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
    });

    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/auth/user');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'You are not authenticated' });
    });

    it('should handle errors when getting user', async () => {
      (userModel.findById as jest.Mock).mockRejectedValue(
        new Error('Error while getting user from DB'),
      );

      const res = await request(app)
        .get('/auth/user')
        .set(
          'Cookie',
          `session=${JSON.stringify({ user: { _id: 'userId' } })}`,
        );

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to get user' });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .set(
          'Cookie',
          `session=${JSON.stringify({ user: { _id: 'userId' } })}`,
        );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Disconnected' });
    });

    it('should still respond with success if no user in session', async () => {
      const res = await request(app).post('/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Disconnected' });
    });
  });
});
