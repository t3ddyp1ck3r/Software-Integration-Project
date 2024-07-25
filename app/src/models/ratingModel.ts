import { Schema, model } from 'mongoose';

interface IRating {
  rating: number;
  movieId: string;
}

const ratingSchema = new Schema<IRating>({
  rating: { type: Number, required: true },
  movieId: { type: String, required: true },
});

const RatingModel = model<IRating>('Rating', ratingSchema);

export default RatingModel;
