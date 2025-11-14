import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { CACHE_DURATIONS, getCacheControlHeader, invalidateProjectsCache, invalidateImageCache, isAdminRequest } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Skip caching for admin requests
  const isAdmin = isAdminRequest(request);
  
  await connectDB();
  try {
    const { id } = await params;
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const response = NextResponse.json(project);
    
    // Add cache headers only for non-admin requests
    if (!isAdmin) {
      response.headers.set(
        'Cache-Control',
        getCacheControlHeader(CACHE_DURATIONS.PROJECTS)
      );
    } else {
      // No cache for admin
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await request.json();
    const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Invalidate cache after updating project
    invalidateProjectsCache();
    
    // If image was updated, invalidate image cache
    if (body.image) {
      invalidateImageCache(body.image);
    }
    
    // If gallery images were updated, invalidate their caches
    if (body.galleryImages && Array.isArray(body.galleryImages)) {
      body.galleryImages.forEach((imageId: string) => {
        if (imageId) {
          invalidateImageCache(imageId);
        }
      });
    }
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  try {
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Invalidate cache after deleting project
    invalidateProjectsCache();
    
    // If project had an image, invalidate image cache
    if (project.image) {
      invalidateImageCache(project.image);
    }
    
    // If project had gallery images, invalidate their caches
    if (project.galleryImages && Array.isArray(project.galleryImages)) {
      project.galleryImages.forEach((imageId: string) => {
        if (imageId) {
          invalidateImageCache(imageId);
        }
      });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

