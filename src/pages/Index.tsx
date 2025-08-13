import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, MapPin, Calendar } from "lucide-react";

const Index = () => {
  // Featured movies
  const featuredMovies = [
    {
      id: "1",
      title: "Avengers: Endgame",
      poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
      rating: 8.4,
      duration: "3h 1m",
      genre: ["Action", "Adventure", "Drama"],
      language: "English"
    },
    {
      id: "2", 
      title: "Spider-Man: No Way Home",
      poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=600&fit=crop",
      rating: 8.2,
      duration: "2h 28m",
      genre: ["Action", "Adventure", "Sci-Fi"],
      language: "English"
    },
    {
      id: "3",
      title: "The Batman",
      poster: "https://images.unsplash.com/photo-1609743522653-52354461eb27?w=400&h=600&fit=crop",
      rating: 7.8,
      duration: "2h 56m", 
      genre: ["Action", "Crime", "Drama"],
      language: "English"
    },
    {
      id: "4",
      title: "Dune",
      poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      rating: 8.0,
      duration: "2h 35m",
      genre: ["Adventure", "Drama", "Sci-Fi"],
      language: "English"
    }
  ];

  const handleBookNow = (movieId: string) => {
    window.location.href = `/movie/${movieId}/seats`;
  };

  const handleExploreMovies = () => {
    window.location.href = '/movies';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-cinema-dark to-background">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              CinemaBook
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your ultimate destination for booking movie tickets. Experience cinema like never before with the best seats, latest movies, and seamless booking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                onClick={handleExploreMovies}
              >
                <Play className="h-5 w-5 mr-2" />
                Book Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-6 text-lg"
              >
                Browse Theaters
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Movies */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Now Showing</h2>
              <p className="text-muted-foreground text-lg">
                Book tickets for the latest blockbusters and experience them on the big screen
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  {...movie}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleExploreMovies}
                className="px-8"
              >
                View All Movies
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-card">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CinemaBook?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Premium Experience</h3>
                  <p className="text-muted-foreground">
                    Choose from the best seats with our interactive seat selection and enjoy premium cinema experience.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Multiple Locations</h3>
                  <p className="text-muted-foreground">
                    Book tickets at theaters across the city. Find the most convenient location near you.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
                  <p className="text-muted-foreground">
                    Simple and fast booking process. Select your movie, choose seats, and confirm - it's that easy!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary-glow">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Book Your Next Movie?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Don't miss out on the latest releases. Book your tickets now and secure the best seats in the house.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg"
              onClick={handleExploreMovies}
            >
              Start Booking
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
