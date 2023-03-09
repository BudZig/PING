import mongoose, { Document, Model, Schema } from 'mongoose';

interface IReview extends Document {
  helper: string;
  rating: number;
  review: string;
  time: string;
}

const ReviewSchema: Schema<IReview> = new Schema({
  helper: String,
  rating: Number,
  review: String,
  time: String,
});

interface IRequest extends Document {
  content: string;
  type: string;
  status: string;
  images: string[];
  review: IReview;
  date: Date;
}

const RequestSchema: Schema<IRequest> = new Schema({
  content: String,
  type: String,
  status: String,
  images: [String],
  review: ReviewSchema,
  date: Date,
});

interface IUser extends Document {
  username: string;
  email: string;
  role: string;
  requests: IRequest[];
  socketID: string;
  online: boolean;
}

const UserSchema: Schema<IUser> = new Schema({
  username: String,
  email: String,
  role: String,
  requests: [RequestSchema],
  socketID: String,
  online: Boolean,
});

const User : Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;




