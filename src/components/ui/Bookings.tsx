import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState<
    {
      id: number;
      user: string;
      movie: string;
      theater: string;
      seats: number;
      amount: number;
    }[]
  >([]);

  // ✅ Load bookings from localStorage when component mounts
  useEffect(() => {
    const storedBookings = localStorage.getItem("bookings");
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  // ✅ Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const handleDelete = (id: number) => {
    const updatedBookings = bookings.filter((b) => b.id !== id);
    setBookings(updatedBookings);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-neutral-900 border border-neutral-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-neutral-400">
              <th className="p-3">ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Movie</th>
              <th className="p-3">Theater</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-neutral-800">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.user}</td>
                  <td className="p-3">{b.movie}</td>
                  <td className="p-3">{b.theater}</td>
                  <td className="p-3">{b.seats}</td>
                  <td className="p-3">₹{b.amount}</td>
                  <td className="p-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(b.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-3 text-center text-neutral-500">
                  No bookings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Bookings;
