import { MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-secondary text-secondary-foreground overflow-hidden">
      {/* Vagues décoratives en haut */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 text-secondary transform rotate-180">
          <path d="M0,60 C400,0 800,120 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
      </div>

      {/* Formes géométriques */}
      <div className="absolute bottom-10 right-20 opacity-20">
        <div className="w-16 h-16 border-2 border-primary/50 rotate-45"></div>
      </div>
      <div className="absolute top-32 right-1/4 opacity-20">
        <div className="w-12 h-12 bg-primary/30 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          {/* Section AfriSpot */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary flex items-center space-x-4">
              <span>AfriSpot</span>
              <div className="w-8 h-0.5 bg-primary"></div>
            </h3>
            
            <nav className="space-y-4">
              <button className="flex items-center space-x-3 text-secondary-foreground/80 hover:text-primary transition-colors duration-300 group">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                <span>Qui sommes nous ?</span>
              </button>
              <button className="flex items-center space-x-3 text-secondary-foreground/80 hover:text-primary transition-colors duration-300 group">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                <span>Contactez-nous</span>
              </button>
              <button className="flex items-center space-x-3 text-secondary-foreground/80 hover:text-primary transition-colors duration-300 group">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                <span>Termes & Conditions</span>
              </button>
            </nav>
          </div>

          {/* Section Contacts */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary flex items-center space-x-4">
              <span>Contacts</span>
              <div className="w-8 h-0.5 bg-primary"></div>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300">
                    Rue 54, Centre, Dakar
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <a 
                    href="tel:+221771234567" 
                    className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    +221 77 123 45 67
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <a 
                    href="mailto:info@afrispot.com" 
                    className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    info@afrispot.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section Horaires */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary flex items-center space-x-4">
              <span>Horaires</span>
              <div className="w-8 h-0.5 bg-primary"></div>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 group">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="font-semibold text-primary">Lundi - Samedi</div>
                    <div className="text-secondary-foreground/80">10h - 00h</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">Dimanche</div>
                    <div className="text-secondary-foreground/80">12h - 22h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="w-full h-px bg-primary/30 mb-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-secondary-foreground/60 text-sm">
            © AfriSpot, Tous droits réservés. Designed By DaKraft
          </div>
          
          {/* Bouton retour en haut */}
          <button 
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-primary hover:text-primary-light transition-colors duration-300"
          >
            <span className="text-sm">Retour en haut</span>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors duration-300">
              <ChevronRight className="w-4 h-4 -rotate-90" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;