import mongoose, { ConnectOptions } from 'mongoose';
import CommentModel from '../models/commentModel';

describe('Comment Model', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/commentsTestDB?retryWrites=true&w=majority`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create and save a comment successfully', async () => {
    const commentData = { content: 'Test comment', postId: '12345' };
    const validComment = new CommentModel(commentData);
    const savedComment = await validComment.save();

    expect(savedComment._id).toBeDefined();
    expect(savedComment.content).toBe(commentData.content);
    expect(savedComment.postId).toBe(commentData.postId);
  });

  it('should fail to create a comment without required fields', async () => {
    const commentData = { content: '' }; // postId is missing
    const invalidComment = new CommentModel(commentData);

    let err;
    try {
      await invalidComment.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        err = error;
      } else {
        console.error('Unexpected error:', error);
      }
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err?.errors.postId).toBeDefined();
  });
});
