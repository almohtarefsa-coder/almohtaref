import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  page: 'home' | 'contact' | 'about';
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    page: {
      type: String,
      enum: ['home', 'contact', 'about'],
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);







