import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Utensils } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 hover-scale cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="relative">
              <Utensils className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-secondary">AfriSpot</span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              À propos
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection('reservation')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Contacts
            </button>
          </nav>

          {/* Bouton Réservez */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('reservation')}
              className="btn-primary"
            >
              Réservez
            </Button>
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-card rounded-lg shadow-lg animate-fade-in-up">
            <nav className="flex flex-col space-y-4 px-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left"
              >
                À propos
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection('reservation')}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-foreground hover:text-primary transition-colors duration-300 text-left"
              >
                Contacts
              </button>
              <Button 
                onClick={() => scrollToSection('reservation')}
                className="btn-primary w-full mt-4"
              >
                Réservez
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;