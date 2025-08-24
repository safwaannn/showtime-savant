import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SeatLayout from "@/components/SeatLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

const SeatSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch single movie from API
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:4000/movies/${id}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">
          Loading movie details...
        </p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500 text-lg">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Movie Info Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-32 h-48 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span>{movie.rating}/10</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{movie.duration}</span>
                      </div>
                      <span>•</span>
                      <span>{movie.language}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {movie.genre?.map((g: string) => (
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
                        <p className="font-medium">{movie.theater}</p>
                        <p className="text-muted-foreground">{movie.screen}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{movie.date}</p>
                        <p className="text-muted-foreground">Date</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{movie.showtime}</p>
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
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back to Movies
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;
