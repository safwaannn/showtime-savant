import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Film, Users } from "lucide-react";
import Header from "../Header"; // ✅ import Header

const Theaters = () => {
  // sample theater data
  const theaters = [
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ✅ Header at top */}
      <Header />

      {/* Content */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Theaters</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theaters.map((theater) => (
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
                <p className="flex items-center text-muted-foreground">
                  <Film className="h-4 w-4 mr-2 text-primary" />
                  Screens: {theater.screens}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Theaters;
