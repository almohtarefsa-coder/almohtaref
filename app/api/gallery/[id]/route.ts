import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import { invalidateImageCache, invalidateGalleryCache } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const galleryImage = await Gallery.findById(id);
    
    if (!galleryImage) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }
    
    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery image' }, { status: 500 });
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
    const { image, alt, altAr, order } = body;
    
    const galleryImage = await Gallery.findByIdAndUpdate(
      id,
      { image, alt, altAr, order },
      { new: true, runValidators: true }
    );
    
    if (!galleryImage) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }
    
    // Invalidate cache after updating gallery image
    if (image) {
      invalidateImageCache(image);
    }
    invalidateGalleryCache();
    
    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const galleryImage = await Gallery.findById(id);
    
    if (!galleryImage) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }
    
    // Invalidate cache before deleting
    invalidateImageCache(galleryImage.image);
    invalidateGalleryCache();
    
    await Gallery.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}

