import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import heroImage from '@/assets/hero-dish.jpg';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-accent via-background to-muted">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Contenu Texte */}
          <div className="space-y-8 animate-fade-in-left">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-secondary leading-tight">
                Taste the essence
                <br />
                <span className="text-primary">of Senegal</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Plongez dans l'authenticité du Sénégal avec chaque bouchée. 
                Une expérience culinaire où tradition et excellence se rencontrent.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="outline"
                className="btn-secondary flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Localiser
              </Button>
              <Button 
                onClick={() => scrollToSection('reservation')}
                className="btn-primary flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Faire une réservation
              </Button>
            </div>
          </div>

          {/* Image du plat */}
          <div className="relative animate-fade-in-right animate-delay-300">
            <div className="relative w-full max-w-md mx-auto">
              {/* Cercle de fond */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl transform scale-110"></div>
              
              {/* Image du plat */}
              <div className="relative bg-white rounded-full p-8 shadow-2xl hover-lift">
                <img 
                  src={heroImage} 
                  alt="Plat traditionnel sénégalais"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Indicateurs de carrousel */}
        <div className="flex justify-center space-x-3 mt-16">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary shadow-lg scale-125' 
                  : 'bg-primary/30 hover:bg-primary/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Vagues décoratives en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 text-background">
          <path d="M0,60 C400,0 800,120 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;