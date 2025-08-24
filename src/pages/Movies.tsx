import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const Movies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const genres = [
    "All",
    "Action",
    "Adventure",
    "Drama",
    "Sci-Fi",
    "Crime",
    "Fantasy",
    "Comedy",
  ];

  // ✅ Fetch movies from fake API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:4000/movies");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const handleBookNow = (movieId: string) => {
    window.location.href = `/movie/${movieId}/seats`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Now Showing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Book your favorite movies and enjoy the ultimate cinema experience
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="border-border">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedGenre === genre
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </Badge>
          ))}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading movies...</p>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} onBookNow={handleBookNow} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No movies found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Movies;
