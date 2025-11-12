# ALMOHTAREF - Next.js Clone

A pixel-perfect clone of the ALMOHTAREF website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: Letter-by-letter text animations in the hero section
- **Interactive Navbar**: Fixed navbar with scroll-based background changes
- **Modern UI**: Clean, dark-themed interface matching the original design
- **Component-Based Architecture**: Modular components for easy maintenance

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
almohtaref/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Hero.tsx         # Hero section with text animation
│   ├── About.tsx        # About section
│   ├── Services.tsx    # Services section
│   ├── Team.tsx         # Team carousel
│   ├── FullServices.tsx # Full services list
│   ├── Gallery.tsx      # Gallery with filters
│   ├── FAQ.tsx          # FAQ accordion
│   ├── SuccessStories.tsx # Success stories
│   └── Footer.tsx       # Footer
└── package.json
```

## Key Components

### Navbar
- Fixed position with scroll-based background opacity
- Smooth entrance animation
- Responsive design

### Hero Section
- Letter-by-letter text animation
- Background image placeholders (ready for your images)
- Smooth scroll animations

### Text Animation
The hero text animation splits each word into individual letters and animates them sequentially. You can customize the animation timing in `components/Hero.tsx`.

## Customization

### Adding Images
Replace the placeholder divs in the Hero component with actual images:
```tsx
<Image src="/path-to-image.jpg" alt="Description" fill className="object-cover" />
```

### Adjusting Colors
Modify the color scheme in `tailwind.config.ts` or update the classes in components.

### Animation Timing
Adjust animation delays and durations in the Framer Motion `transition` props.

## Build for Production

```bash
npm run build
npm start
```

## Notes

- The hero animation uses a screen recording approach as requested - the animation structure is in place for you to replace with your video
- All image placeholders are ready for your actual images
- The design is pixel-perfect based on the original Framer site
- Navbar animations and text animations are fully functional

## License

This project is a clone for educational/portfolio purposes.






