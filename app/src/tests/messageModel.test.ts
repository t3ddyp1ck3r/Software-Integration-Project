import mongoose, { ConnectOptions } from 'mongoose';
import MessageModel from '../models/messageModel';

describe('Message Model', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/messagesTestDB?retryWrites=true&w=majority`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a message successfully', async () => {
    const messageData = { content: 'Test message', recipientId: '12345' };
    const validMessage = new MessageModel(messageData);
    const savedMessage = await validMessage.save();

    expect(savedMessage._id).toBeDefined();
    expect(savedMessage.content).toBe(messageData.content);
    expect(savedMessage.recipientId).toBe(messageData.recipientId);
  });

  it('should fail to create a message without required fields', async () => {
    const messageData = { content: '' }; // recipientId is missing
    const invalidMessage = new MessageModel(messageData);

    let err;
    try {
      await invalidMessage.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      } else {
        console.error('Unexpected error:', error);
      }
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.recipientId).toBeDefined();
  });
});
