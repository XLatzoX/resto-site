import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import MenuManagement from '@/components/admin/MenuManagement';
import ReservationsManagement from '@/components/admin/ReservationsManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au site
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administration AfriSpot</h1>
              <p className="text-muted-foreground">Gestion du restaurant</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Menu className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Avis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Menu</CardTitle>
                <CardDescription>
                  Gérez les catégories et les plats de votre restaurant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Réservations</CardTitle>
                <CardDescription>
                  Consultez et gérez les réservations des clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReservationsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Avis</CardTitle>
                <CardDescription>
                  Modérez et approuvez les avis clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewsManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;