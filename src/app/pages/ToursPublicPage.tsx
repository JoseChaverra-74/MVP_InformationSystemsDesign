import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { TourCard } from '../components/TourCard';
import { mockTours } from '../lib/mockData';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

export function ToursPublicPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Todos', 'Cultura', 'Aventura', 'Gastronomía', 'Naturaleza'];

  const filteredTours = mockTours.filter((tour) => {
    const matchesCategory = selectedCategory === 'Todos' || tour.category === selectedCategory;
    const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReserve = (tourId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/tours/${tourId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant={isAuthenticated ? 'tourist' : 'public'} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display' }}>
          Explora nuestros tours
        </h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                onReserve={handleReserve}
                linkTo={`/tours/${tour.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay tours disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
