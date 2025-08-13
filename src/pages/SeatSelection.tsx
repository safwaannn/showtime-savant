import Header from "@/components/Header";
import SeatLayout from "@/components/SeatLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

const SeatSelection = () => {
  // Sample movie and showtime data
  const movieData = {
    title: "Avengers: Endgame",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=400&fit=crop",
    rating: 8.4,
    duration: "3h 1m",
    genre: ["Action", "Adventure", "Drama"],
    language: "English",
    theater: "PVR Cinemas - Mall of India",
    screen: "Screen 3",
    showtime: "7:30 PM",
    date: "Today, Jan 15"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Movie Info Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={movieData.poster} 
                alt={movieData.title}
                className="w-32 h-48 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{movieData.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span>{movieData.rating}/10</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{movieData.duration}</span>
                      </div>
                      <span>•</span>
                      <span>{movieData.language}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {movieData.genre.map((g) => (
                        <Badge key={g} variant="outline">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Showtime Info */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{movieData.theater}</p>
                        <p className="text-muted-foreground">{movieData.screen}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{movieData.date}</p>
                        <p className="text-muted-foreground">Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{movieData.showtime}</p>
                        <p className="text-muted-foreground">Show Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seat Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Select Your Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <SeatLayout />
          </CardContent>
        </Card>

        {/* Go Back Button */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            ← Back to Movies
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;