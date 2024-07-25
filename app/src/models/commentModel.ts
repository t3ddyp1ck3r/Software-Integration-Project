import { Schema, model } from 'mongoose';

interface IComment {
  content: string;
  postId: string;
}

const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  postId: { type: String, required: true },
});

const CommentModel = model<IComment>('Comment', commentSchema);

export default CommentModel;
