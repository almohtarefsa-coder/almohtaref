import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import connectDB from '../lib/mongodb';
import Video from '../models/Video';
import { uploadVideo } from '../lib/gridfs';

// Retry function for uploads
const retryUpload = async (
  videoBuffer: Buffer,
  filename: string,
  contentType: string,
  maxRetries = 3,
  delay = 2000
): Promise<string> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Upload attempt ${attempt}/${maxRetries} for ${filename}...`);
      return await uploadVideo(videoBuffer, filename, contentType);
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      // Reconnect to database
      await connectDB();
    }
  }
  throw new Error('Upload failed after all retries');
};

const seedVideos = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing videos
    await Video.deleteMany({});
    console.log('Cleared existing videos');

    const videosDir = join(process.cwd(), 'public', 'almohtaref');
    
    // Video data with titles and descriptions
    const videoData = [
      {
        filename: 'VID-20251114-WA0002.mp4',
        title: 'Concrete Cutting Demonstration',
        titleAr: 'عرض توضيحي لقص الخرسانة',
        description: 'Professional concrete cutting service demonstration showing precision diamond wire cutting technology.',
        descriptionAr: 'عرض توضيحي لخدمة قص الخرسانة الاحترافية يوضح تقنية قص سلك الماس الدقيقة.',
        order: 0,
      },
      {
        filename: 'VID-20251114-WA0003.mp4',
        title: 'Reinforced Concrete Cutting Process',
        titleAr: 'عملية قص الخرسانة المسلحة',
        description: 'Step-by-step process of cutting through reinforced concrete structures with advanced equipment.',
        descriptionAr: 'عملية خطوة بخطوة لقص هياكل الخرسانة المسلحة باستخدام معدات متقدمة.',
        order: 1,
      },
      {
        filename: 'VID-20251114-WA0004.mp4',
        title: 'Professional Drilling Services',
        titleAr: 'خدمات الحفر الاحترافية',
        description: 'Expert drilling services for various construction and renovation projects.',
        descriptionAr: 'خدمات الحفر الخبيرة لمشاريع البناء والتجديد المختلفة.',
        order: 2,
      },
    ];

    const seededVideos = [];

    for (const videoInfo of videoData) {
      try {
        const videoPath = join(videosDir, videoInfo.filename);
        
        // Check if file exists
        if (!existsSync(videoPath)) {
          console.warn(`File not found: ${videoInfo.filename}, skipping...`);
          continue;
        }
        
        console.log(`\nProcessing: ${videoInfo.filename}`);
        console.log(`Reading video file: ${videoPath}`);
        
        // Read video file
        const videoBuffer = readFileSync(videoPath);
        console.log(`Video file size: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        // Determine content type based on file extension
        const contentType = videoInfo.filename.endsWith('.mp4') 
          ? 'video/mp4' 
          : 'video/mp4'; // Default to mp4

        // Upload to GridFS with retry logic
        console.log(`Uploading ${videoInfo.filename} to GridFS...`);
        const videoFileId = await retryUpload(videoBuffer, videoInfo.filename, contentType);
        console.log(`✓ Uploaded ${videoInfo.filename} with ID: ${videoFileId}`);

        // Create video document
        const video = await Video.create({
          video: videoFileId,
          title: videoInfo.title,
          titleAr: videoInfo.titleAr,
          description: videoInfo.description,
          descriptionAr: videoInfo.descriptionAr,
          order: videoInfo.order,
        });

        seededVideos.push(video);
        console.log(`✓ Created video document: ${videoInfo.title}`);
      } catch (error: any) {
        console.error(`✗ Error processing ${videoInfo.filename}:`, error.message || error);
        // Continue with next video
      }
    }

    console.log(`\nSuccessfully seeded ${seededVideos.length} videos:`);
    seededVideos.forEach((video, index) => {
      console.log(`  ${index + 1}. ${video.title} (ID: ${video._id})`);
    });

    console.log('\nVideo seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding videos:', error);
    process.exit(1);
  }
};

seedVideos();

