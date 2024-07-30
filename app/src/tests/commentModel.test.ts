import mongoose from 'mongoose';
import CommentModel from '../models/commentModel';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.release' });

describe('CommentModel', () => {
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

  it('should create a comment successfully', async () => {
    const commentData = { content: 'This is a comment', postId: '1' };
    const comment = new CommentModel(commentData);

    const savedComment = await comment.save();

    expect(savedComment._id).toBeDefined();
    expect(savedComment.content).toBe(commentData.content);
    expect(savedComment.postId).toBe(commentData.postId);
  });

  it('should require content and postId', async () => {
    const commentData = { content: '', postId: '' };
    const comment = new CommentModel(commentData);

    await expect(comment.save()).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});
