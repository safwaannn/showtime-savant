import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Film, 
  Calendar, 
  MapPin, 
  Users,
  TrendingUp
} from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("movies");

  // Sample data
  const movies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action, Adventure",
      duration: "181 min",
      rating: "PG-13",
      status: "Now Showing"
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home", 
      genre: "Action, Adventure",
      duration: "148 min",
      rating: "PG-13",
      status: "Now Showing"
    }
  ];

  const showtimes = [
    {
      id: 1,
      movie: "Avengers: Endgame",
      theater: "Screen 1",
      time: "14:30",
      date: "2024-01-15",
      availableSeats: 45
    },
    {
      id: 2,
      movie: "Spider-Man: No Way Home",
      theater: "Screen 2", 
      time: "18:00",
      date: "2024-01-15",
      availableSeats: 30
    }
  ];

  const stats = [
    { title: "Total Movies", value: "24", icon: Film, change: "+2" },
    { title: "Today's Bookings", value: "156", icon: Users, change: "+12%" },
    { title: "Active Screens", value: "8", icon: MapPin, change: "0" },
    { title: "Revenue Today", value: "₹45,230", icon: TrendingUp, change: "+8%" }
  ];

  const TabButton = ({ id, label, isActive, onClick }: any) => (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={() => onClick(id)}
      className={isActive ? "bg-primary" : ""}
    >
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Back to Site
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-accent">
                      {stat.change} from yesterday
                    </p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <TabButton
            id="movies"
            label="Movies"
            isActive={activeTab === "movies"}
            onClick={setActiveTab}
          />
          <TabButton
            id="showtimes"
            label="Showtimes"
            isActive={activeTab === "showtimes"}
            onClick={setActiveTab}
          />
          <TabButton
            id="theaters"
            label="Theaters"
            isActive={activeTab === "theaters"}
            onClick={setActiveTab}
          />
          <TabButton
            id="bookings"
            label="Bookings"
            isActive={activeTab === "bookings"}
            onClick={setActiveTab}
          />
        </div>

        {/* Movies Tab */}
        {activeTab === "movies" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Manage Movies</CardTitle>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Movie
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movies.map((movie) => (
                  <div 
                    key={movie.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{movie.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {movie.genre} • {movie.duration} • {movie.rating}
                      </p>
                      <Badge 
                        variant="default" 
                        className="mt-2 bg-accent text-accent-foreground"
                      >
                        {movie.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Showtimes Tab */}
        {activeTab === "showtimes" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Manage Showtimes</CardTitle>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Showtime
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {showtimes.map((show) => (
                  <div 
                    key={show.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{show.movie}</h3>
                      <p className="text-sm text-muted-foreground">
                        {show.theater} • {show.date} • {show.time}
                      </p>
                      <p className="text-sm text-accent mt-1">
                        {show.availableSeats} seats available
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Movie Form (when adding new movie) */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New Movie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Movie Title</Label>
                  <Input id="title" placeholder="Enter movie title" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="120" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter movie description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" placeholder="Action, Adventure" />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input id="rating" placeholder="PG-13" />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" placeholder="English" />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button className="bg-primary hover:bg-primary/90">
                  Save Movie
                </Button>
                <Button variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;