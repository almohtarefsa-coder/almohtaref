import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { CACHE_DURATIONS, getCacheControlHeader, isAdminRequest } from '@/lib/cache';

export async function GET(request: NextRequest) {
  // Skip caching for admin requests
  const isAdmin = isAdminRequest(request);
  
  await connectDB();
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: 1 });
    
    const response = NextResponse.json(videos);
    
    // Add cache headers only for non-admin requests
    if (!isAdmin) {
      response.headers.set(
        'Cache-Control',
        getCacheControlHeader(CACHE_DURATIONS.IMAGES)
      );
    } else {
      // No cache for admin
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json();
    const { video, title, titleAr, description, descriptionAr, thumbnail, order } = body;
    
    const videoDoc = await Video.create({
      video,
      title,
      titleAr,
      description,
      descriptionAr,
      thumbnail,
      order: order || 0,
    });
    
    return NextResponse.json(videoDoc);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

