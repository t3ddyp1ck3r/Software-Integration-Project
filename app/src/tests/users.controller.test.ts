import request from 'supertest';
import { app } from '../index';
import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the UserModel
jest.mock('../models/userModel');
jest.mock('bcrypt');

describe('Users Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');
      (UserModel.prototype.save as jest.Mock).mockResolvedValue({});

      const res = await request(app).post('/register').send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'User registered successfully' });
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({ username: 'testuser' }); // Missing email and password

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 409 if user already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      (UserModel.findOne as jest.Mock).mockResolvedValueOnce(userData); // User already exists

      const res = await request(app).post('/register').send(userData);

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'User already exists' });
    });

    it('should handle errors while registering user', async () => {
      (UserModel.prototype.save as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      const res = await request(app).post('/register').send(userData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to register user' });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const loginData = { email: 'test@example.com', password: 'password' };
      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue('token');

      const res = await request(app).post('/login').send(loginData);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ token: 'token' });
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com' }); // Missing password

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 401 if email does not exist', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password',
      };
      (UserModel.findOne as jest.Mock).mockResolvedValue(null); // User not found

      const res = await request(app).post('/login').send(loginData);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should return 401 if password is invalid', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      const user = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false); // Password does not match

      const res = await request(app).post('/login').send(loginData);

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should handle errors while logging in user', async () => {
      const loginData = { email: 'test@example.com', password: 'password' };
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'userId',
        password: 'hashedPassword',
      });
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error('JWT error');
      });

      const res = await request(app).post('/login').send(loginData);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to log in user' });
    });
  });
});
