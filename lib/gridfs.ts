import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import connectDB from './mongodb';

let gridFSBucket: GridFSBucket | null = null;

export async function getGridFSBucket(): Promise<GridFSBucket> {
  if (gridFSBucket) {
    return gridFSBucket;
  }

  await connectDB();
  const db = mongoose.connection.db;
  
  if (!db) {
    throw new Error('Database connection not available');
  }

  gridFSBucket = new GridFSBucket(db, {
    bucketName: 'images',
  });

  return gridFSBucket;
}

export async function uploadFile(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const bucket = await getGridFSBucket();
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
    });

    uploadStream.on('finish', () => {
      resolve(uploadStream.id.toString());
    });

    uploadStream.on('error', (error) => {
      reject(error);
    });

    uploadStream.end(file);
  });
}

export async function getFile(fileId: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string } | null> {
  const bucket = await getGridFSBucket();
  
  try {
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    
    if (files.length === 0) {
      return null;
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    return {
      stream: downloadStream,
      contentType: file.contentType || 'application/octet-stream',
    };
  } catch (error) {
    console.error('Error getting file:', error);
    return null;
  }
}

export async function deleteFile(fileId: string): Promise<boolean> {
  const bucket = await getGridFSBucket();
  
  try {
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}







