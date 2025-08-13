import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  rating: number;
  duration: string;
  genre: string[];
  language: string;
  onBookNow: (id: string) => void;
}

const MovieCard = ({ 
  id, 
  title, 
  poster, 
  rating, 
  duration, 
  genre, 
  language, 
  onBookNow 
}: MovieCardProps) => {
  return (
    <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-cinema">
      <div className="relative overflow-hidden">
        <img 
          src={poster} 
          alt={title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-cinema-dark/80 text-foreground">
            {language}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-cinema-dark/80 px-2 py-1 rounded">
          <Star className="h-4 w-4 text-accent fill-accent" />
          <span className="text-sm font-medium text-foreground">{rating}/10</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-1">{title}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="outline" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => onBookNow(id)}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;