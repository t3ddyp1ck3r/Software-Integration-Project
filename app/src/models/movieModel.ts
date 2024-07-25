import { Schema, model, Document } from 'mongoose';

interface IMovie extends Document {
  title: string;
  description: string;
  rating: number;
  seenBy: string[];
}

const movieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const MovieModel = model<IMovie>('Movie', movieSchema);

export default MovieModel;
