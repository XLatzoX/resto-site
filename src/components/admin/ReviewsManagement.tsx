import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Trash2, Star, User, Calendar } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';

const ReviewsManagement = () => {
  const { reviews, loading, updateReview, deleteReview } = useReviews();
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'featured'>('all');

  if (loading) {
    return <div className="text-center p-8">Chargement...</div>;
  }

  // Approuver/désapprouver un commentaire
  const toggleApproval = async (id: string, currentStatus: boolean) => {
    await updateReview(id, { approved: !currentStatus });
  };

  // Mettre en avant/retirer de la mise en avant
  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    await updateReview(id, { featured: !currentStatus });
  };

  // Supprimer un commentaire
  const handleDeleteReview = async (id: string) => {
    await deleteReview(id);
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
                      <span>{formatDate(review.created_at)}</span>
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
                  onClick={() => toggleApproval(review.id, review.approved)}
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
                  onClick={() => toggleFeatured(review.id, review.featured)}
                  className={review.featured ? "text-orange-600 hover:bg-orange-50" : "text-blue-600 hover:bg-blue-50"}
                >
                  <Star className={`w-4 h-4 mr-1 ${review.featured ? 'fill-current' : ''}`} />
                  {review.featured ? 'Retirer' : 'Mettre en avant'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteReview(review.id)}
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