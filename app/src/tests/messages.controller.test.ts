import request from 'supertest';
import { app } from '../index';
import MessageModel from '../models/messageModel';

// Mock the MessageModel
jest.mock('../models/messageModel');

describe('Messages Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addMessage', () => {
    it('should add a message successfully', async () => {
      const mockMessage = {
        _id: 'messageId',
        content: 'Hello!',
        recipientId: 'userId1',
      };
      (MessageModel.prototype.save as jest.Mock).mockResolvedValue(mockMessage);

      const res = await request(app)
        .post('/messages')
        .send({ content: 'Hello!', recipientId: 'userId1' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockMessage);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/messages')
        .send({ content: '', recipientId: 'userId1' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 if recipientId is missing', async () => {
      const res = await request(app)
        .post('/messages')
        .send({ content: 'Hello!' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required fields' });
    });

    it('should handle errors when adding a message', async () => {
      (MessageModel.prototype.save as jest.Mock).mockRejectedValue(
        new Error('Error adding message'),
      );

      const res = await request(app)
        .post('/messages')
        .send({ content: 'Hello!', recipientId: 'userId1' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error adding message' });
    });
  });

  describe('getMessages', () => {
    it('should get all messages successfully', async () => {
      const mockMessages = [
        { _id: 'messageId1', content: 'Hello!', recipientId: 'userId1' },
        { _id: 'messageId2', content: 'Hi there!', recipientId: 'userId2' },
      ];
      (MessageModel.find as jest.Mock).mockResolvedValue(mockMessages);

      const res = await request(app).get('/messages');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMessages);
    });

    it('should return an empty array if no messages found', async () => {
      (MessageModel.find as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/messages');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]); // Should return an empty array if no messages found
    });

    it('should handle errors when fetching messages', async () => {
      (MessageModel.find as jest.Mock).mockRejectedValue(
        new Error('Error fetching messages'),
      );

      const res = await request(app).get('/messages');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching messages' });
    });
  });

  describe('editMessage', () => {
    it('should update a message successfully', async () => {
      const mockMessage = {
        _id: 'messageId',
        content: 'Updated message!',
        recipientId: 'userId1',
      };
      (MessageModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        mockMessage,
      );

      const res = await request(app)
        .put('/messages/messageId')
        .send({ content: 'Updated message!' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMessage);
    });

    it('should return 404 if message is not found', async () => {
      (MessageModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .put('/messages/messageId')
        .send({ content: 'Updated message!' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Message not found' });
    });

    it('should handle errors when updating a message', async () => {
      (MessageModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error('Error updating message'),
      );

      const res = await request(app)
        .put('/messages/messageId')
        .send({ content: 'Updated message!' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error updating message' });
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message successfully', async () => {
      const mockMessage = {
        _id: 'messageId',
        content: 'Hello!',
        recipientId: 'userId1',
      };
      (MessageModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        mockMessage,
      );

      const res = await request(app).delete('/messages/messageId');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Message deleted' });
    });

    it('should return 404 if message is not found', async () => {
      (MessageModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete('/messages/messageId');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Message not found' });
    });

    it('should handle errors when deleting a message', async () => {
      (MessageModel.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error('Error deleting message'),
      );

      const res = await request(app).delete('/messages/messageId');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error deleting message' });
    });
  });

  describe('getMessageById', () => {
    it('should get a message by ID successfully', async () => {
      const mockMessage = {
        _id: 'messageId',
        content: 'Hello!',
        recipientId: 'userId1',
      };
      (MessageModel.findById as jest.Mock).mockResolvedValue(mockMessage);

      const res = await request(app).get('/messages/messageId');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMessage);
    });

    it('should return 404 if message is not found', async () => {
      (MessageModel.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/messages/messageId');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Message not found' });
    });

    it('should handle errors when fetching a message by ID', async () => {
      (MessageModel.findById as jest.Mock).mockRejectedValue(
        new Error('Error fetching message'),
      );

      const res = await request(app).get('/messages/messageId');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Error fetching message' });
    });
  });
});
