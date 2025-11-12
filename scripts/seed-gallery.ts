import connectDB from '../lib/mongodb';
import Gallery from '../models/Gallery';
import { uploadFile } from '../lib/gridfs';
import * as fs from 'fs';
import * as path from 'path';

const galleryImages = [
  { 
    filename: 'IMG-20251111-WA0028.webp', 
    alt: 'Diamond saw cutting reinforced wall',
    altAr: 'منشار الماس يقطع الجدار المسلح',
    order: 0,
  },
  { 
    filename: 'IMG-20251111-WA0037.webp', 
    alt: 'Crew preparing safety harnesses for elevated work',
    altAr: 'الطاقم يستعد بأحزمة الأمان للعمل المرتفع',
    order: 1,
  },
  { 
    filename: 'IMG-20251111-WA0038.webp', 
    alt: 'Detail of finished concrete surface after repair',
    altAr: 'تفاصيل سطح الخرسانة النهائي بعد الإصلاح',
    order: 2,
  },
  { 
    filename: 'IMG-20251111-WA0032.webp', 
    alt: 'Completed wall opening with clean edges',
    altAr: 'فتحة الجدار المكتملة بحواف نظيفة',
    order: 3,
  },
  { 
    filename: 'IMG-20251111-WA0034.webp', 
    alt: 'Concrete cutting tools arranged on site',
    altAr: 'أدوات قطع الخرسانة مرتبة في الموقع',
    order: 4,
  },
  { 
    filename: 'WhatsApp Image 2025-11-11 at 18.29.40_f2ca1be1.webp', 
    alt: 'Precise plumbing and electrical installation work',
    altAr: 'عمل دقيق في السباكة والتركيبات الكهربائية',
    order: 5,
  },
];

const seedGallery = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing gallery images
    await Gallery.deleteMany({});
    console.log('Cleared existing gallery images');

    const publicPath = path.join(process.cwd(), 'public');

    for (const imageData of galleryImages) {
      const filePath = path.join(publicPath, imageData.filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${imageData.filename}, skipping...`);
        continue;
      }

      // Read file
      const fileBuffer = fs.readFileSync(filePath);
      
      // Determine content type based on extension
      const contentType = imageData.filename.endsWith('.webp') 
        ? 'image/webp' 
        : imageData.filename.endsWith('.jpg') || imageData.filename.endsWith('.jpeg')
        ? 'image/jpeg'
        : imageData.filename.endsWith('.png')
        ? 'image/png'
        : 'image/webp';

      // Upload to GridFS
      console.log(`Uploading ${imageData.filename} to GridFS...`);
      const fileId = await uploadFile(fileBuffer, imageData.filename, contentType);
      console.log(`Uploaded ${imageData.filename} with ID: ${fileId}`);

      // Save to database
      await Gallery.create({
        image: fileId,
        alt: imageData.alt,
        altAr: imageData.altAr,
        order: imageData.order,
      });
      console.log(`Saved ${imageData.filename} to database`);
    }

    console.log(`Seeded ${galleryImages.length} gallery images`);
    console.log('Gallery seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding gallery:', error);
    process.exit(1);
  }
};

seedGallery();

