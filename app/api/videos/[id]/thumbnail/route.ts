import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { getVideo, uploadFile } from '@/lib/gridfs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const video = await Video.findById(id);
    
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Get video file from GridFS
    const videoData = await getVideo(video.video);
    if (!videoData) {
      return NextResponse.json({ error: 'Video file not found' }, { status: 404 });
    }

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of videoData.stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const videoBuffer = Buffer.concat(chunks);

    // Save video to temp file
    const tempVideoPath = join(tmpdir(), `video-${Date.now()}.mp4`);
    const tempThumbnailPath = join(tmpdir(), `thumbnail-${Date.now()}.jpg`);
    
    try {
      writeFileSync(tempVideoPath, videoBuffer);

      // Check if ffmpeg is available
      try {
        await execAsync('ffmpeg -version');
      } catch {
        return NextResponse.json({ 
          error: 'FFmpeg is not installed. Please install FFmpeg to generate thumbnails automatically, or upload a thumbnail manually.',
          requiresFFmpeg: true
        }, { status: 400 });
      }

      // Extract thumbnail at 1 second (or 10% of video duration)
      // Using ffmpeg to extract a frame
      await execAsync(
        `ffmpeg -i "${tempVideoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${tempThumbnailPath}" -y`
      );

      if (!existsSync(tempThumbnailPath)) {
        throw new Error('Thumbnail generation failed');
      }

      // Read thumbnail file
      const thumbnailBuffer = require('fs').readFileSync(tempThumbnailPath);

      // Upload thumbnail to GridFS
      const thumbnailId = await uploadFile(
        thumbnailBuffer,
        `thumbnail-${video._id}-${Date.now()}.jpg`,
        'image/jpeg'
      );

      // Update video with thumbnail
      video.thumbnail = thumbnailId;
      await video.save();

      // Clean up temp files
      try {
        unlinkSync(tempVideoPath);
        unlinkSync(tempThumbnailPath);
      } catch (e) {
        console.warn('Failed to clean up temp files:', e);
      }

      return NextResponse.json({
        success: true,
        thumbnailId,
        message: 'Thumbnail generated successfully',
      });
    } catch (error: any) {
      // Clean up temp files on error
      try {
        if (existsSync(tempVideoPath)) unlinkSync(tempVideoPath);
        if (existsSync(tempThumbnailPath)) unlinkSync(tempThumbnailPath);
      } catch (e) {
        console.warn('Failed to clean up temp files:', e);
      }

      console.error('Thumbnail generation error:', error);
      return NextResponse.json({ 
        error: 'Failed to generate thumbnail. Please upload a thumbnail manually.',
        details: error.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json({ error: 'Failed to generate thumbnail' }, { status: 500 });
  }
}

