import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

// Define a type for showtime
type Showtime = {
  id: number;
  movie: string;
  theater: string;
  date: string;
  time: string;
  screen: number;
};

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([
    {
      id: 1,
      movie: "Jawan",
      theater: "Cinepolis Pune",
      date: "2025-09-20",
      time: "19:30",
      screen: 1,
    },
    {
      id: 2,
      movie: "Pathaan",
      theater: "INOX Camp",
      date: "2025-09-21",
      time: "18:00",
      screen: 2,
    },
  ]);

  const [newShowtime, setNewShowtime] = useState<Omit<Showtime, "id">>({
    movie: "",
    theater: "",
    date: "",
    time: "",
    screen: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewShowtime({
      ...newShowtime,
      [name]: name === "screen" ? Number(value) : value, // convert screen to number
    });
  };

  const handleSave = () => {
    setShowtimes([...showtimes, { id: Date.now(), ...newShowtime }]);
    setNewShowtime({ movie: "", theater: "", date: "", time: "", screen: 0 });
  };

  const handleDelete = (id: number) => {
    setShowtimes(showtimes.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <Card className="p-4 bg-neutral-900 border border-neutral-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-neutral-400">
              <th className="p-3">ID</th>
              <th className="p-3">Movie</th>
              <th className="p-3">Theater</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Screen</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((s) => (
              <tr key={s.id} className="border-t border-neutral-800">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.movie}</td>
                <td className="p-3">{s.theater}</td>
                <td className="p-3">{s.date}</td>
                <td className="p-3">{s.time}</td>
                <td className="p-3">{s.screen}</td>
                <td className="p-3 flex gap-2">
                  <Button size="icon" variant="ghost">
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Add Showtime Form */}
      <Card className="p-4 bg-neutral-900 border border-neutral-800">
        <h3 className="text-lg font-semibold mb-4">Add New Showtime</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="movie"
            placeholder="Movie Name"
            value={newShowtime.movie}
            onChange={handleChange}
          />
          <Input
            name="theater"
            placeholder="Theater"
            value={newShowtime.theater}
            onChange={handleChange}
          />
          <Input
            name="date"
            type="date"
            value={newShowtime.date}
            onChange={handleChange}
          />
          <Input
            name="time"
            type="time"
            value={newShowtime.time}
            onChange={handleChange}
          />
          <Input
            name="screen"
            type="number"
            placeholder="Screen No."
            value={newShowtime.screen || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            Save Showtime
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setNewShowtime({
                movie: "",
                theater: "",
                date: "",
                time: "",
                screen: 0,
              })
            }
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Showtimes;
