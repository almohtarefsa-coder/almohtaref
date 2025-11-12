import connectDB from '../lib/mongodb';
import Service from '../models/Service';
import Project from '../models/Project';
import Testimonial from '../models/Testimonial';
import Banner from '../models/Banner';
import Admin from '../models/Admin';
import Gallery from '../models/Gallery';

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await Banner.deleteMany({});
    await Admin.deleteMany({});
    await Gallery.deleteMany({});

    // Seed Services
    const services = await Service.insertMany([
      {
        title: 'Concrete Cutting',
        titleAr: 'قطع الخرسانة',
        description: 'Precision concrete cutting services for construction and renovation projects. Professional equipment and expert technicians ensure clean, accurate cuts every time.',
        descriptionAr: 'خدمات قطع الخرسانة الدقيقة لمشاريع البناء والتجديد. المعدات الاحترافية والفنيون الخبراء يضمنون قطعًا نظيفًا ودقيقًا في كل مرة.',
        icon: 'concrete-cutting',
        features: ['Diamond blade cutting', 'Precision accuracy', 'Minimal dust', '24-hour service'],
        featuresAr: ['قطع بشفرة الماس', 'دقة عالية', 'غبار قليل', 'خدمة على مدار 24 ساعة'],
        featured: true,
      },
      {
        title: 'Reinforced Concrete Cutting',
        titleAr: 'قطع الخرسانة المسلحة',
        description: 'Specialized cutting services for reinforced concrete structures. Safe and efficient solutions for complex projects requiring structural integrity.',
        descriptionAr: 'خدمات قطع متخصصة للهياكل الخرسانية المسلحة. حلول آمنة وفعالة للمشاريع المعقدة التي تتطلب السلامة الهيكلية.',
        icon: 'reinforced-concrete',
        features: ['Reinforcement handling', 'Structural integrity', 'Safety compliance', 'Expert team'],
        featuresAr: ['معالجة التسليح', 'السلامة الهيكلية', 'الامتثال للسلامة', 'فريق خبير'],
        featured: true,
      },
      {
        title: 'Drilling Services',
        titleAr: 'خدمات الحفر',
        description: 'Professional drilling services for various applications. From small precision holes to large diameter core drilling, we handle it all.',
        descriptionAr: 'خدمات الحفر الاحترافية لتطبيقات متنوعة. من الثقوب الصغيرة الدقيقة إلى الحفر الأساسي بقطر كبير، نحن نتعامل مع كل شيء.',
        icon: 'drilling',
        features: ['Multiple diameters', 'Core drilling', 'Anchor holes', 'Precision work'],
        featuresAr: ['أقطار متعددة', 'الحفر الأساسي', 'ثقوب التثبيت', 'عمل دقيق'],
        featured: true,
      },
      {
        title: 'Crack Repair',
        titleAr: 'إصلاح الشقوق',
        description: 'Expert crack repair and concrete restoration services. Extend the life of your concrete structures with our proven repair techniques.',
        descriptionAr: 'خدمات إصلاح الشقوق واستعادة الخرسانة الخبيرة. إطالة عمر هياكلك الخرسانية بتقنيات الإصلاح المجربة.',
        icon: 'crack-repair',
        features: ['Epoxy injection', 'Structural repair', 'Long-lasting solutions', 'Quality guarantee'],
        featuresAr: ['حقن الإيبوكسي', 'إصلاح هيكلي', 'حلول طويلة الأمد', 'ضمان الجودة'],
        featured: false,
      },
      {
        title: 'Deliberate Demolition',
        titleAr: 'الهدم المتعمد',
        description: 'Controlled demolition services with precision and safety. Professional planning and execution for safe, efficient project completion.',
        descriptionAr: 'خدمات الهدم المتحكم بها بدقة وأمان. التخطيط والتنفيذ الاحترافي لإكمال المشروع بأمان وكفاءة.',
        icon: 'demolition',
        features: ['Controlled demolition', 'Safety protocols', 'Debris management', 'Licensed professionals'],
        featuresAr: ['هدم متحكم به', 'بروتوكولات السلامة', 'إدارة الحطام', 'محترفون مرخصون'],
        featured: false,
      },
      {
        title: 'Consultation Services',
        titleAr: 'خدمات الاستشارة',
        description: 'Expert consultation for your concrete and construction needs. Professional advice and project planning to ensure optimal results.',
        descriptionAr: 'استشارة خبيرة لاحتياجاتك الخرسانية والبناء. المشورة المهنية وتخطيط المشروع لضمان النتائج المثلى.',
        icon: 'consultation',
        features: ['Project assessment', 'Cost estimation', 'Technical advice', 'Free consultations'],
        featuresAr: ['تقييم المشروع', 'تقدير التكلفة', 'نصيحة فنية', 'استشارات مجانية'],
        featured: false,
      },
    ]);

    console.log(`Seeded ${services.length} services`);

    // Seed Projects
    const projects = await Project.insertMany([
      {
        title: 'Commercial Building Core Drilling',
        titleAr: 'حفر الأساس للمبنى التجاري',
        description: 'Precision core drilling for HVAC and plumbing systems in a 20-story commercial complex.',
        descriptionAr: 'حفر أساس دقيق لأنظمة التدفئة والتهوية وتكييف الهواء والسباكة في مجمع تجاري مكون من 20 طابقًا.',
        image: '/drilling-service.webp',
        tags: ['Drilling', 'Commercial', 'HVAC'],
        tagsAr: ['حفر', 'تجاري', 'تكييف'],
        category: 'Drilling',
        categoryAr: 'حفر',
        year: '2024',
        featured: true,
      },
      {
        title: 'Reinforced Concrete Wall Cutting',
        titleAr: 'قطع جدار الخرسانة المسلحة',
        description: 'Diamond saw cutting through reinforced concrete walls for structural modifications.',
        descriptionAr: 'قطع بمنشار الماس عبر جدران الخرسانة المسلحة للتعديلات الهيكلية.',
        image: '/cutting-reinforced-service.webp',
        tags: ['Cutting', 'Reinforced', 'Structural'],
        tagsAr: ['قطع', 'مسلح', 'هيكلي'],
        category: 'Cutting',
        categoryAr: 'قطع',
        year: '2024',
        featured: true,
      },
      {
        title: 'Thick Slab Diamond Wire Cutting',
        titleAr: 'قطع البلاطة السميكة بسلك الماس',
        description: 'Advanced diamond wire technology used to cut through 2-meter thick concrete slabs.',
        descriptionAr: 'تقنية سلك الماس المتقدمة المستخدمة لقطع البلاطات الخرسانية بسمك 2 متر.',
        image: '/cutting-concrete-service.webp',
        tags: ['Cutting', 'Diamond Wire', 'Industrial'],
        tagsAr: ['قطع', 'سلك الماس', 'صناعي'],
        category: 'Cutting',
        categoryAr: 'قطع',
        year: '2023',
        featured: true,
      },
      {
        title: 'Epoxy Crack Repair System',
        titleAr: 'نظام إصلاح الشقوق بالإيبوكسي',
        description: 'Comprehensive crack repair using epoxy injection for structural integrity restoration.',
        descriptionAr: 'إصلاح شامل للشقوق باستخدام حقن الإيبوكسي لاستعادة السلامة الهيكلية.',
        image: '/repairingCracks.webp',
        tags: ['Repair', 'Epoxy', 'Maintenance'],
        tagsAr: ['إصلاح', 'إيبوكسي', 'صيانة'],
        category: 'Repair',
        categoryAr: 'إصلاح',
        year: '2024',
        featured: false,
      },
      {
        title: 'Selective Demolition Project',
        titleAr: 'مشروع الهدم الانتقائي',
        description: 'Deliberate demolition preserving concrete structure while removing non-load bearing elements.',
        descriptionAr: 'هدم متعمد مع الحفاظ على الهيكل الخرساني مع إزالة العناصر غير الحاملة.',
        image: '/DeliberateService.webp',
        tags: ['Demolition', 'Selective', 'Preservation'],
        tagsAr: ['هدم', 'انتقائي', 'الحفظ'],
        category: 'Demolition',
        categoryAr: 'هدم',
        year: '2023',
        featured: false,
      },
      {
        title: 'Residential Basement Opening',
        titleAr: 'فتح القبو السكني',
        description: 'Creating precise openings in residential basement walls for egress and ventilation.',
        descriptionAr: 'إنشاء فتحات دقيقة في جدران الأقبية السكنية للخروج والتهوية.',
        image: '/IMG-20251111-WA0028.webp',
        tags: ['Cutting', 'Residential', 'Precision'],
        tagsAr: ['قطع', 'سكني', 'دقة'],
        category: 'Cutting',
        categoryAr: 'قطع',
        year: '2024',
        featured: false,
      },
      {
        title: 'Industrial Floor Core Sampling',
        titleAr: 'أخذ عينات الأساس للأرضية الصناعية',
        description: 'Multiple core samples extracted for structural analysis and quality assessment.',
        descriptionAr: 'استخراج عينات أساس متعددة للتحليل الهيكلي وتقييم الجودة.',
        image: '/drilling-service.webp',
        tags: ['Drilling', 'Industrial', 'Analysis'],
        tagsAr: ['حفر', 'صناعي', 'تحليل'],
        category: 'Drilling',
        categoryAr: 'حفر',
        year: '2024',
        featured: false,
      },
      {
        title: 'Bridge Deck Repair & Cutting',
        titleAr: 'إصلاح وقطع سطح الجسر',
        description: 'Specialized cutting and repair work on bridge deck structures with minimal disruption.',
        descriptionAr: 'عمل قطع وإصلاح متخصص على هياكل سطح الجسر مع الحد الأدنى من الاضطراب.',
        image: '/cutting-concrete-service.webp',
        tags: ['Cutting', 'Infrastructure', 'Repair'],
        tagsAr: ['قطع', 'بنية تحتية', 'إصلاح'],
        category: 'Cutting',
        categoryAr: 'قطع',
        year: '2023',
        featured: false,
      },
    ]);

    console.log(`Seeded ${projects.length} projects`);

    // Seed Testimonials
    const testimonials = await Testimonial.insertMany([
      {
        name: 'Ahmed Al-Mansoori',
        company: 'Construction Manager',
        location: 'Jeddah',
        rating: 5,
        text: 'Exceptional service and professional team. They delivered exactly what we needed on time and within budget.',
        textAr: 'خدمة استثنائية وفريق محترف. لقد قدموا بالضبط ما نحتاجه في الوقت المحدد وفي الميزانية.',
        approved: true,
      },
      {
        name: 'Fatima Al-Zahra',
        company: 'Project Coordinator',
        location: 'Mecca',
        rating: 5,
        text: 'The quality of work exceeded our expectations. Highly recommend their services for any concrete project.',
        textAr: 'تجاوزت جودة العمل توقعاتنا. أوصي بشدة بخدماتهم لأي مشروع خرساني.',
        approved: true,
      },
      {
        name: 'Mohammed Al-Rashid',
        company: 'Site Engineer',
        location: 'Taif',
        rating: 5,
        text: 'Professional, reliable, and cost-effective. Best choice for concrete services in the region.',
        textAr: 'محترف وموثوق وفعال من حيث التكلفة. الخيار الأفضل لخدمات الخرسانة في المنطقة.',
        approved: true,
      },
      {
        name: 'Eng. Sarah Al-Harbi',
        company: 'Jeddah Contracting Company',
        location: 'Jeddah',
        rating: 5,
        text: "The best team I've worked with for concrete cutting. They adhered to safety and deadlines 100%. Highly professional and reliable service.",
        textAr: 'أفضل فريق عملت معه في قطع الخرسانة. التزموا بالسلامة والمواعيد النهائية 100%. خدمة احترافية وموثوقة للغاية.',
        approved: true,
      },
      {
        name: 'Mohammed Al-Otaibi',
        company: 'Residential Project Manager',
        location: 'Mecca',
        rating: 5,
        text: 'Air conditioner openings were completed without any cracks, and delivery was within less than 12 hours. I highly recommend them.',
        textAr: 'اكتملت فتحات مكيفات الهواء دون أي شقوق، وكان التسليم في أقل من 12 ساعة. أوصي بهم بشدة.',
        approved: true,
      },
      {
        name: 'Ahmed Al-Zahrani',
        company: 'Construction Director',
        location: 'Taif',
        rating: 5,
        text: 'Outstanding precision work on our demolition project. The team was punctual, professional, and the cleanup was impeccable.',
        textAr: 'عمل دقيق متميز في مشروع الهدم لدينا. كان الفريق في الوقت المحدد ومحترفًا وكان التنظيف لا تشوبه شائبة.',
        approved: true,
      },
    ]);

    console.log(`Seeded ${testimonials.length} testimonials`);

    // Seed Banners
    const banners = await Banner.insertMany([
      {
        page: 'home',
        image: '/banner.webp',
      },
      {
        page: 'contact',
        image: '/banner.webp',
      },
      {
        page: 'about',
        image: '/banner.webp',
      },
    ]);

    console.log(`Seeded ${banners.length} banners`);

    // Note: Gallery images should be seeded separately using npm run seed:gallery
    // This is because gallery images need to be uploaded to GridFS from the public folder
    console.log('Note: Run "npm run seed:gallery" to seed gallery images');

    // Seed Admin (default username: admin, password: admin123)
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123',
    });

    console.log('Seeded admin user (username: admin, password: admin123)');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

