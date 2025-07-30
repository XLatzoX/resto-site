import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Reservation from '@/components/Reservation';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { initScrollReveal, cleanupScrollReveal } from '@/utils/scrollReveal';

const Index = () => {
  useEffect(() => {
    const observer = initScrollReveal();
    
    return () => {
      cleanupScrollReveal(observer);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <Reservation />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
