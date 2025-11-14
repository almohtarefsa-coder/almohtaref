import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import FullServices from '@/components/FullServices';
import Gallery from '@/components/Gallery';
import Videos from '@/components/Videos';
import SuccessStories from '@/components/SuccessStories';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <About />
      <Services />
      <FullServices />
      <Gallery />
      <Videos />
      <SuccessStories />
      <Footer />
    </main>
  );
}

