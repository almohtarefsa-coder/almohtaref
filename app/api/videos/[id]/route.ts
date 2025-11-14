import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { deleteVideo } from '@/lib/gridfs';

export async function GET(
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
    
    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await request.json();
    const { video, title, titleAr, description, descriptionAr, thumbnail, order } = body;
    
    const videoDoc = await Video.findByIdAndUpdate(
      id,
      { video, title, titleAr, description, descriptionAr, thumbnail, order },
      { new: true, runValidators: true }
    );
    
    if (!videoDoc) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    return NextResponse.json(videoDoc);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const videoDoc = await Video.findById(id);
    
    if (!videoDoc) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    
    // Delete video file from GridFS
    await deleteVideo(videoDoc.video);
    
    // Delete thumbnail if exists
    if (videoDoc.thumbnail) {
      const { deleteFile } = await import('@/lib/gridfs');
      await deleteFile(videoDoc.thumbnail);
    }
    
    await Video.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}

