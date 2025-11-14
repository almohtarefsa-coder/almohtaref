import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import connectDB from './mongodb';

let gridFSBucket: GridFSBucket | null = null;
let videosBucket: GridFSBucket | null = null;

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

export async function getVideosBucket(): Promise<GridFSBucket> {
  if (videosBucket) {
    return videosBucket;
  }

  await connectDB();
  const db = mongoose.connection.db;
  
  if (!db) {
    throw new Error('Database connection not available');
  }

  videosBucket = new GridFSBucket(db, {
    bucketName: 'videos',
  });

  return videosBucket;
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

export async function uploadVideo(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  // Ensure we have a fresh connection
  await connectDB();
  const bucket = await getVideosBucket();
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
    });

    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        uploadStream.destroy();
        reject(new Error('Upload timeout after 60 seconds'));
      }
    }, 60000); // 60 second timeout

    uploadStream.on('finish', () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve(uploadStream.id.toString());
      }
    });

    uploadStream.on('error', (error) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(error);
      }
    });

    // Write the buffer - GridFS will handle chunking internally
    uploadStream.end(file);
  });
}

export async function getVideo(fileId: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string } | null> {
  const bucket = await getVideosBucket();
  
  try {
    const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
    
    if (files.length === 0) {
      return null;
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    return {
      stream: downloadStream,
      contentType: file.contentType || 'video/mp4',
    };
  } catch (error) {
    console.error('Error getting video:', error);
    return null;
  }
}

export async function deleteVideo(fileId: string): Promise<boolean> {
  const bucket = await getVideosBucket();
  
  try {
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
}







