import mongoose from 'mongoose';
import MessageModel from '../models/messageModel';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.release' });

describe('MessageModel', () => {
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

  it('should create a message successfully', async () => {
    const messageData = { content: 'This is a message', recipientId: '1' };
    const message = new MessageModel(messageData);

    const savedMessage = await message.save();

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.content).toBe(messageData.content);
    expect(savedMessage.recipientId).toBe(messageData.recipientId);
  });

  it('should require content and recipientId', async () => {
    const messageData = { content: '', recipientId: '' };
    const message = new MessageModel(messageData);

    await expect(message.save()).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
