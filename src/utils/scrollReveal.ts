// Utilitaire pour les animations au scroll
export const initScrollReveal = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  // Observer tous les éléments avec la classe scroll-reveal
  const elements = document.querySelectorAll('.scroll-reveal');
  elements.forEach(element => {
    observer.observe(element);
  });

  return observer;
};

// Fonction pour nettoyer l'observer
export const cleanupScrollReveal = (observer: IntersectionObserver) => {
  observer.disconnect();
};