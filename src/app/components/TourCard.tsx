import { Star, Clock, Users, MapPin } from 'lucide-react';
import { Tour } from '../lib/mockData';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router';

interface TourCardProps {
  tour: Tour;
  onReserve?: (tourId: string) => void;
  showReserveButton?: boolean;
  linkTo?: string;
}

export function TourCard({ tour, onReserve, showReserveButton = true, linkTo }: TourCardProps) {
  const categoryColors: Record<string, string> = {
    Cultura: 'bg-purple-100 text-purple-800',
    Aventura: 'bg-green-100 text-green-800',
    Gastronomía: 'bg-orange-100 text-orange-800',
    Naturaleza: 'bg-emerald-100 text-emerald-800',
  };

  const isAvailable = tour.availableSpots > 0;

  const cardContent = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={tour.images[0]}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-3 left-3 ${categoryColors[tour.category]}`}>
          {tour.category}
        </Badge>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{tour.rating.toFixed(1)}</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{tour.duration} horas</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{tour.availableSpots} cupos</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{tour.city}</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold" style={{ color: '#1A6B4A' }}>
              ${tour.price.toLocaleString('es-CO')}
            </p>
            <p className="text-xs text-gray-500">COP por persona</p>
          </div>
          {showReserveButton && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onReserve && isAvailable) {
                  onReserve(tour.id);
                }
              }}
              disabled={!isAvailable}
              size="sm"
            >
              {isAvailable ? 'Reservar' : 'Agotado'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{cardContent}</Link>;
  }

  return cardContent;
}
