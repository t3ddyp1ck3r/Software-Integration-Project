import mongoose, { ConnectOptions } from 'mongoose';
import UserModel from '../models/userModel';

describe('User Model', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/usersTestDB?retryWrites=true&w=majority`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a user successfully', async () => {
    const userData = { username: 'testuser', email: 'testuser@example.com', password: 'password' };
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
  });

  it('should fail to create a user without required fields', async () => {
    const userData = { username: '', email: 'invalidemail', password: '' }; // email format is invalid
    const invalidUser = new UserModel(userData);

    let err;
    try {
      await invalidUser.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      } else {
        console.error('Unexpected error:', error);
      }
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.username).toBeDefined();
    expect(err?.errors.email).toBeDefined();
    expect(err?.errors.password).toBeDefined();
  });
});
