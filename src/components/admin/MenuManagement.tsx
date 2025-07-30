import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, Save, X, Upload } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  createdAt: string;
}

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'entrées',
    image: '',
    available: true
  });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const categories = ['entrées', 'plats', 'desserts', 'boissons'];

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('afrispot_menu');
    if (savedItems) {
      setMenuItems(JSON.parse(savedItems));
    } else {
      // Données d'exemple
      const mockItems: MenuItem[] = [
        {
          id: '1',
          name: 'Thieboudienne',
          description: 'Plat traditionnel sénégalais avec poisson et légumes',
          price: 2500,
          category: 'plats',
          image: '/src/assets/dish-1.jpg',
          available: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Yassa Poulet',
          description: 'Poulet mariné aux oignons et citron',
          price: 2000,
          category: 'plats',
          image: '/src/assets/dish-2.jpg',
          available: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Pastels',
          description: 'Beignets de poisson traditionnels',
          price: 500,
          category: 'entrées',
          image: '/src/assets/dish-3.jpg',
          available: true,
          createdAt: new Date().toISOString()
        }
      ];
      setMenuItems(mockItems);
      localStorage.setItem('afrispot_menu', JSON.stringify(mockItems));
    }
  }, []);

  // Sauvegarder dans localStorage
  const saveToStorage = (items: MenuItem[]) => {
    localStorage.setItem('afrispot_menu', JSON.stringify(items));
  };

  // Ajouter un plat
  const handleAddItem = () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name!,
      description: newItem.description!,
      price: newItem.price!,
      category: newItem.category!,
      image: newItem.image || '',
      available: newItem.available!,
      createdAt: new Date().toISOString()
    };

    const updatedItems = [...menuItems, item];
    setMenuItems(updatedItems);
    saveToStorage(updatedItems);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'entrées',
      image: '',
      available: true
    });
    setIsAdding(false);

    toast({
      title: "Plat ajouté",
      description: "Le plat a été ajouté au menu avec succès",
    });
  };

  // Modifier un plat
  const handleUpdateItem = () => {
    if (!editingItem) return;

    const updatedItems = menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    setMenuItems(updatedItems);
    saveToStorage(updatedItems);
    setEditingItem(null);

    toast({
      title: "Plat modifié",
      description: "Le plat a été modifié avec succès",
    });
  };

  // Supprimer un plat
  const handleDeleteItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedItems);
    saveToStorage(updatedItems);

    toast({
      title: "Plat supprimé",
      description: "Le plat a été supprimé du menu",
    });
  };

  // Basculer la disponibilité
  const toggleAvailability = (id: string) => {
    const updatedItems = menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    );
    setMenuItems(updatedItems);
    saveToStorage(updatedItems);
  };

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Gestion du Menu</h2>
          <p className="text-muted-foreground">Gérez les plats, prix et disponibilités</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un plat
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau plat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Nom du plat"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Prix (FCFA)"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
            <Textarea
              placeholder="Description du plat"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <select
                className="w-full p-2 border rounded-md"
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <Input
                placeholder="URL de l'image"
                value={newItem.image}
                onChange={(e) => setNewItem(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddItem} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="w-4 h-4" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des plats par catégorie */}
      {categories.map(category => {
        const categoryItems = menuItems.filter(item => item.category === category);
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category} ({categoryItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryItems.map(item => (
                  <div key={item.id} className="border rounded-lg p-4">
                    {editingItem?.id === item.id ? (
                      // Mode édition
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            value={editingItem.name}
                            onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                          />
                          <Input
                            type="number"
                            value={editingItem.price}
                            onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                          />
                        </div>
                        <Textarea
                          value={editingItem.description}
                          onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                        />
                        <Input
                          placeholder="URL de l'image"
                          value={editingItem.image}
                          onChange={(e) => setEditingItem(prev => prev ? { ...prev, image: e.target.value } : null)}
                        />
                        <div className="flex space-x-2">
                          <Button onClick={handleUpdateItem} size="sm">
                            <Save className="w-4 h-4" />
                            Sauvegarder
                          </Button>
                          <Button variant="outline" onClick={() => setEditingItem(null)} size="sm">
                            <X className="w-4 h-4" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Mode affichage
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <Badge variant={item.available ? "default" : "secondary"}>
                              {item.available ? 'Disponible' : 'Indisponible'}
                            </Badge>
                            <span className="text-primary font-bold">{item.price} FCFA</span>
                          </div>
                          <p className="text-muted-foreground mb-2">{item.description}</p>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAvailability(item.id)}
                          >
                            {item.available ? 'Marquer indisponible' : 'Marquer disponible'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MenuManagement;