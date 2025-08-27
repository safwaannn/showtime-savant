import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SeatLayout from "@/components/SeatLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  duration: string;
  rating: number | string; // ✅ supports both
  genre: string[] | string; // ✅ supports array or string
  language: string;
  poster?: string;
}

interface Theater {
  id: number;
  name: string;
  location: string;
  screens: number;
}

const SeatSelection = () => {
  const { id } = useParams<{ id: string }>(); // movieId
  const location = useLocation();
  const navigate = useNavigate();

  const { theaterId } = location.state || {};

  const [movie, setMovie] = useState<Movie | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // ✅ Fetch movie & theater (first from localStorage, then API if not found)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedMovies = JSON.parse(localStorage.getItem("movies") || "[]");
        const storedTheaters = JSON.parse(
          localStorage.getItem("theaters") || "[]"
        );

        let movieData = storedMovies.find((m: Movie) => m.id === Number(id));

        if (!movieData) {
          const movieRes = await fetch(`http://localhost:4000/movies/${id}`);
          movieData = await movieRes.json();
        }

        setMovie(movieData);

        if (theaterId) {
          let theaterData = storedTheaters.find(
            (t: Theater) => t.id === Number(theaterId)
          );

          if (!theaterData) {
            const theaterRes = await fetch(
              `http://localhost:4000/theaters/${theaterId}`
            );
            theaterData = await theaterRes.json();
          }

          setTheater(theaterData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, theaterId]);

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

  // ✅ Normalize genres
  const genres = Array.isArray(movie.genre)
    ? movie.genre
    : movie.genre.split(",").map((g: string) => g.trim());

  // ✅ Confirm booking
  const handleConfirmBooking = () => {
    navigate("/booking-receipt", {
      state: {
        movieTitle: movie.title,
        theater: theater?.name,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * 200, // assume ₹200 per seat
        showDate: new Date().toLocaleDateString(),
        showTime: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 🎬 Movie Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={
                  movie.poster ||
                  "https://via.placeholder.com/150x220?text=No+Poster"
                }
                alt={movie.title}
                className="w-32 h-48 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>

                <div className="flex items-center gap-4 text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent fill-accent" />
                    <span>{movie.rating}</span>
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
                  {genres.map((g: string) => (
                    <Badge key={g} variant="outline">
                      {g}
                    </Badge>
                  ))}
                </div>

                {/* 🏢 Theater Info */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">
                          {theater?.name || "PVR Cinemas"}
                        </p>
                        <p className="text-muted-foreground">
                          {theater?.location || "Unknown Location"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">
                          {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-muted-foreground">Date</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-muted-foreground">Show Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🪑 Seat Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Select Your Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <SeatLayout
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
            />
          </CardContent>
        </Card>

        {/* 🔙 Back & Confirm */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Back to Movies
          </Button>

          {selectedSeats.length > 0 && (
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleConfirmBooking}
            >
              Confirm Booking ({selectedSeats.length} seats)
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default SeatSelection;
