import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Film, Users } from "lucide-react";
import Header from "../Header";

interface Theater {
  id: number;
  name: string;
  location: string;
  capacity: number;
  screens: number;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  status: string;
  theaterId?: number; // ✅ link movie with theater
}

const Theaters = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  // ✅ Load from localStorage
  useEffect(() => {
    const storedTheaters = JSON.parse(localStorage.getItem("theaters") || "[]");
    const storedMovies = JSON.parse(localStorage.getItem("movies") || "[]");
    setTheaters(storedTheaters);
    setMovies(storedMovies);
  }, []);

  // ✅ Navigate to SeatSelection with movie + theater
  const handleMovieClick = (movie: Movie, theater: Theater) => {
    navigate(`/seat-selection/${movie.id}`, {
      state: {
        theaterId: theater.id,
        theaterName: theater.name,
        movieTitle: movie.title,
        movieDuration: movie.duration,
        movieGenre: movie.genre,
        movieRating: movie.rating,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">🎬 Theaters & Movies</h1>
        {theaters.length === 0 ? (
          <p className="text-muted-foreground">No theaters available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theaters.map((theater) => {
              const theaterMovies = movies.filter(
                (m) => m.theaterId === theater.id
              );

              return (
                <Card
                  key={theater.id}
                  className="shadow-md hover:shadow-lg transition"
                >
                  <CardHeader>
                    <CardTitle>{theater.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {theater.location}
                    </p>
                    <p className="flex items-center text-muted-foreground mb-2">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      Capacity: {theater.capacity}
                    </p>
                    <p className="flex items-center text-muted-foreground mb-4">
                      <Film className="h-4 w-4 mr-2 text-primary" />
                      Screens: {theater.screens}
                    </p>

                    {/* 🎬 Movies for this theater */}
                    {theaterMovies.length > 0 ? (
                      <div className="space-y-2">
                        <p className="font-semibold mb-2">Now Showing:</p>
                        {theaterMovies.map((movie) => (
                          <button
                            key={movie.id}
                            onClick={() => handleMovieClick(movie, theater)}
                            className="w-full text-left p-2 border rounded-md hover:bg-primary hover:text-white transition"
                          >
                            <p className="font-medium">{movie.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {movie.genre} • {movie.duration} • {movie.rating}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No movies assigned to this theater.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Theaters;
