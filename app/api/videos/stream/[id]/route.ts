import { NextRequest, NextResponse } from 'next/server';
import { getVideo } from '@/lib/gridfs';
import { CACHE_DURATIONS, getCacheControlHeader, isAdminRequest } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Skip caching for admin requests
  const isAdmin = isAdminRequest(request);
  
  try {
    const { id } = await params;
    const fileData = await getVideo(id);

    if (!fileData) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of fileData.stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return video with appropriate headers
    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': fileData.contentType,
        'Content-Length': buffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

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
    console.error('Error serving video:', error);
    return NextResponse.json({ error: 'Failed to serve video' }, { status: 500 });
  }
}

