import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string; // SVG icon name or identifier
  image?: string; // Optional image path
  features: string[];
  featuresAr: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
    featuresAr: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);







