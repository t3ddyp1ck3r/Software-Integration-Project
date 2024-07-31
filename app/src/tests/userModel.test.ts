import mongoose from 'mongoose';
import UserModel from '../models/userModel';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.release' });

describe('UserModel', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a user successfully', async () => {
    const userData = {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
    };
    const user = new UserModel(userData);

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });

  it('should require username, email, and password', async () => {
    const userData = { username: '', email: '', password: '' };
    const user = new UserModel(userData);

    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should require unique email', async () => {
    const userData1 = {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
    };
    const user1 = new UserModel(userData1);
    await user1.save();

    const userData2 = {
      username: 'user2',
      email: 'user1@example.com',
      password: 'password456',
    };
    const user2 = new UserModel(userData2);

    await expect(user2.save()).rejects.toThrow();
  });
});
