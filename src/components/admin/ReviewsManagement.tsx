import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Trash2, Star, User, Calendar } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  email?: string;
}

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'featured'>('all');
  const { toast } = useToast();

  // Charger les commentaires depuis localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem('afrispot_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Données d'exemple
      const mockReviews: Review[] = [
        {
          id: '1',
          name: 'Amadou Diallo',
          rating: 5,
          comment: 'Excellent restaurant ! La cuisine authentique sénégalaise est délicieuse. Le thieboudienne était parfait.',
          approved: true,
          featured: true,
          createdAt: '2024-02-10T14:30:00',
          email: 'amadou@email.com'
        },
        {
          id: '2',
          name: 'Fatou Sall',
          rating: 5,
          comment: 'Ambiance chaleureuse et service impeccable. Je recommande vivement ce lieu pour découvrir la vraie cuisine africaine.',
          approved: true,
          featured: true,
          createdAt: '2024-02-11T16:45:00',
          email: 'fatou@email.com'
        },
        {
          id: '3',
          name: 'Jean Pierre',
          rating: 4,
          comment: 'Très bon restaurant, les saveurs sont authentiques. Seul bémol, un peu d\'attente mais ça en vaut la peine.',
          approved: true,
          featured: false,
          createdAt: '2024-02-12T12:20:00',
          email: 'jean@email.com'
        },
        {
          id: '4',
          name: 'Marie Dubois',
          rating: 5,
          comment: 'Découverte fantastique ! Les plats sont savoureux et le personnel très accueillant.',
          approved: false,
          featured: false,
          createdAt: '2024-02-13T18:30:00',
          email: 'marie@email.com'
        },
        {
          id: '5',
          name: 'Ousmane Ndiaye',
          rating: 2,
          comment: 'Service décevant, plats froids et attente trop longue. Je ne recommande pas.',
          approved: false,
          featured: false,
          createdAt: '2024-02-14T20:15:00',
          email: 'ousmane@email.com'
        }
      ];
      setReviews(mockReviews);
      localStorage.setItem('afrispot_reviews', JSON.stringify(mockReviews));
    }
  }, []);

  // Sauvegarder dans localStorage
  const saveToStorage = (reviewsData: Review[]) => {
    localStorage.setItem('afrispot_reviews', JSON.stringify(reviewsData));
  };

  // Approuver/désapprouver un commentaire
  const toggleApproval = (id: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === id ? { ...review, approved: !review.approved } : review
    );
    setReviews(updatedReviews);
    saveToStorage(updatedReviews);

    const review = reviews.find(r => r.id === id);
    toast({
      title: review?.approved ? "Commentaire désapprouvé" : "Commentaire approuvé",
      description: review?.approved ? "Le commentaire ne sera plus visible" : "Le commentaire est maintenant visible",
    });
  };

  // Mettre en avant/retirer de la mise en avant
  const toggleFeatured = (id: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === id ? { ...review, featured: !review.featured } : review
    );
    setReviews(updatedReviews);
    saveToStorage(updatedReviews);

    const review = reviews.find(r => r.id === id);
    toast({
      title: review?.featured ? "Retiré de la mise en avant" : "Mis en avant",
      description: review?.featured ? "Le commentaire ne sera plus mis en avant" : "Le commentaire sera affiché en priorité",
    });
  };

  // Supprimer un commentaire
  const deleteReview = (id: string) => {
    const updatedReviews = reviews.filter(review => review.id !== id);
    setReviews(updatedReviews);
    saveToStorage(updatedReviews);

    toast({
      title: "Commentaire supprimé",
      description: "Le commentaire a été supprimé définitivement",
    });
  };

  // Filtrer les commentaires
  const filteredReviews = reviews.filter(review => {
    switch (filter) {
      case 'approved': return review.approved;
      case 'pending': return !review.approved;
      case 'featured': return review.featured;
      default: return true;
    }
  });

  // Rendu des étoiles
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (approved: boolean) => {
    return approved ? 'bg-green-500' : 'bg-yellow-500';
  };

  const getStatusText = (approved: boolean) => {
    return approved ? 'Approuvé' : 'En attente';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary">Gestion des Commentaires</h2>
        <p className="text-muted-foreground">Modérez et gérez les avis clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{reviews.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reviews.filter(r => r.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">Approuvés</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {reviews.filter(r => !r.approved).length}
              </div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {reviews.filter(r => r.featured).length}
              </div>
              <div className="text-sm text-muted-foreground">Mis en avant</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          Tous ({reviews.length})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
          size="sm"
        >
          Approuvés ({reviews.filter(r => r.approved).length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
          size="sm"
        >
          En attente ({reviews.filter(r => !r.approved).length})
        </Button>
        <Button
          variant={filter === 'featured' ? 'default' : 'outline'}
          onClick={() => setFilter('featured')}
          size="sm"
        >
          Mis en avant ({reviews.filter(r => r.featured).length})
        </Button>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(review.approved)}>
                    {getStatusText(review.approved)}
                  </Badge>
                  {review.featured && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Mis en avant
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-muted-foreground">
                    ({review.rating}/5)
                  </span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleApproval(review.id)}
                  className={review.approved ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                >
                  {review.approved ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Désapprouver
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Approuver
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeatured(review.id)}
                  className={review.featured ? "text-orange-600 hover:bg-orange-50" : "text-blue-600 hover:bg-blue-50"}
                >
                  <Star className={`w-4 h-4 mr-1 ${review.featured ? 'fill-current' : ''}`} />
                  {review.featured ? 'Retirer' : 'Mettre en avant'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteReview(review.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Aucun commentaire trouvé pour ce filtre.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewsManagement;