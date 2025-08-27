import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import TheaterTable from "@/components/ui/TheaterTable";
import { Edit, Trash2, Film, MapPin, Users, TrendingUp } from "lucide-react";

// ✅ Define props for TabButton
interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState("movies");

  // ✅ Load from localStorage or default values
  const [theaters, setTheaters] = useState(() => {
    const saved = localStorage.getItem("theaters");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Cinepolis Pune",
            location: "MG Road, Pune",
            capacity: 250,
            screens: 4,
          },
          {
            id: 2,
            name: "INOX Camp",
            location: "Camp, Pune",
            capacity: 180,
            screens: 3,
          },
        ];
  });

  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem("movies");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Avengers: Endgame",
            genre: "Action, Adventure",
            duration: "181 min",
            rating: "PG-13",
            status: "Now Showing",
            theaterId: 1,
          },
          {
            id: 2,
            title: "Spider-Man: No Way Home",
            genre: "Action, Adventure",
            duration: "148 min",
            rating: "PG-13",
            status: "Now Showing",
            theaterId: 2,
          },
        ];
  });

  // ✅ Sync to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem("theaters", JSON.stringify(theaters));
  }, [theaters]);

  // ✅ Movie Form state
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [theaterId, setTheaterId] = useState<number | "">(""); // ✅ NEW

  // ✅ Theater Form state
  const [tName, setTName] = useState("");
  const [tLocation, setTLocation] = useState("");
  const [tCapacity, setTCapacity] = useState("");
  const [tScreens, setTScreens] = useState("");

  // ✅ Add Movie
  function handleAddMovie(e: React.FormEvent) {
    e.preventDefault();
    if (!theaterId) {
      alert("Please select a theater!");
      return;
    }

    const newMovie = {
      id: Date.now(),
      title,
      genre,
      duration: `${duration} min`,
      rating,
      status: "Coming Soon",
      theaterId, // ✅ Link movie to theater
    };

    setMovies((prev) => [...prev, newMovie]);

    // reset form
    setTitle("");
    setDuration("");
    setGenre("");
    setRating("");
    setLanguage("");
    setDescription("");
    setTheaterId("");
  }

  // ✅ Delete Movie
  function handleDeleteMovie(id: number) {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  }

  // ✅ Add Theater
  function handleAddTheater(e: React.FormEvent) {
    e.preventDefault();
    const newTheater = {
      id: Date.now(),
      name: tName,
      location: tLocation,
      capacity: Number(tCapacity),
      screens: Number(tScreens),
    };
    setTheaters((prev) => [...prev, newTheater]);
    setTName("");
    setTLocation("");
    setTCapacity("");
    setTScreens("");
  }

  // ✅ Delete Theater
  function handleDeleteTheater(id: number) {
    setTheaters((prev) => prev.filter((t) => t.id !== id));
  }

  const stats = [
    {
      title: "Total Movies",
      value: movies.length.toString(),
      icon: Film,
      change: "+2",
    },
    { title: "Today's Bookings", value: "156", icon: Users, change: "+12%" },
    {
      title: "Active Screens",
      value: theaters.length.toString(),
      icon: MapPin,
      change: "0",
    },
    {
      title: "Revenue Today",
      value: "₹45,230",
      icon: TrendingUp,
      change: "+8%",
    },
  ];

  const TabButton = ({ id, label, isActive, onClick }: TabButtonProps) => (
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
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
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
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
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

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <TabButton
            id="movies"
            label="Movies"
            isActive={activeTab === "movies"}
            onClick={setActiveTab}
          />
          <TabButton
            id="theaters"
            label="Theaters"
            isActive={activeTab === "theaters"}
            onClick={setActiveTab}
          />
          <TabButton
            id="showtimes"
            label="Showtimes"
            isActive={activeTab === "showtimes"}
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
          <>
            <Card>
              <CardHeader>
                <CardTitle>Manage Movies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movies.map((movie) => {
                    const theater = theaters.find(
                      (t) => t.id === movie.theaterId
                    );
                    return (
                      <div
                        key={movie.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{movie.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {movie.genre} • {movie.duration} • {movie.rating}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            🎬 Theater: {theater?.name || "Unknown"}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMovie(movie.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Add Movie Form */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Movie</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddMovie} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Movie Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="genre">Genre</Label>
                        <Input
                          id="genre"
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                          id="rating"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Input
                          id="language"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* ✅ Theater dropdown */}
                    <div>
                      <Label htmlFor="theater">Assign to Theater</Label>
                      <select
                        id="theater"
                        className="w-full border rounded-md p-2 mt-1"
                        value={theaterId}
                        onChange={(e) => setTheaterId(Number(e.target.value))}
                        required
                      >
                        <option value="">-- Select Theater --</option>
                        {theaters.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.location})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Save Movie
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTitle("")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Theaters Tab */}
        {activeTab === "theaters" && (
          <>
            <TheaterTable
              theaters={theaters}
              onDelete={handleDeleteTheater}
              onEdit={(id) => console.log("Edit theater", id)}
            />

            {/* Add Theater Form */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Theater</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTheater} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tName">Theater Name</Label>
                        <Input
                          id="tName"
                          value={tName}
                          onChange={(e) => setTName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="tLocation">Location</Label>
                        <Input
                          id="tLocation"
                          value={tLocation}
                          onChange={(e) => setTLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tCapacity">Capacity</Label>
                        <Input
                          id="tCapacity"
                          type="number"
                          value={tCapacity}
                          onChange={(e) => setTCapacity(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="tScreens">Screens</Label>
                        <Input
                          id="tScreens"
                          type="number"
                          value={tScreens}
                          onChange={(e) => setTScreens(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Save Theater
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTName("")}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
