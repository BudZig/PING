import mongoose, { Schema, Document, Model } from 'mongoose' ;

export interface ITagline extends Document {
  tagline: string;
}

const TaglineSchema: Schema<ITagline> = new Schema({
  tagline: String,
});

interface ITaglineModel extends Model<ITagline> {}

const Tagline: Model<ITagline> = mongoose.model<ITagline, ITaglineModel>("Tagline", TaglineSchema);

export default Tagline

