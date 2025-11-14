import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  video: string; // GridFS file ID
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  thumbnail?: string; // GridFS file ID for thumbnail image
  order: number; // For ordering videos
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    video: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
    },
    description: {
      type: String,
    },
    descriptionAr: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

