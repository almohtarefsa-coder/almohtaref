import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo } from '@/lib/gridfs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type - allow video files
    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo', // avi
      'video/x-matroska', // mkv
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only video files are allowed.' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to GridFS videos bucket
    const fileId = await uploadVideo(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      fileId,
      filename: file.name,
      contentType: file.type,
      url: `/api/videos/stream/${fileId}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}

