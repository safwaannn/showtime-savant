import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

type SeatStatus = "available" | "selected" | "booked";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

const SeatLayout = () => {
  const navigate = useNavigate();

  // ✅ generate seats
  const [seats, setSeats] = useState<Seat[]>(() => {
    const seatLayout: Seat[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    rows.forEach((row, rowIndex) => {
      for (let seatNum = 1; seatNum <= 12; seatNum++) {
        const isBooked = Math.random() < 0.15; // 15% chance booked
        seatLayout.push({
          id: `${row}${seatNum}`,
          row,
          number: seatNum,
          status: isBooked ? "booked" : "available",
          price: rowIndex < 3 ? 200 : rowIndex < 7 ? 150 : 100,
        });
      }
    });

    return seatLayout;
  });

  const selectedSeats = seats.filter((seat) => seat.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleSeatClick = (seatId: string) => {
    setSeats(
      seats.map((seat) => {
        if (seat.id === seatId && seat.status !== "booked") {
          return {
            ...seat,
            status: seat.status === "selected" ? "available" : "selected",
          };
        }
        return seat;
      })
    );
  };

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case "available":
        return "bg-seat-available hover:bg-seat-available/80";
      case "selected":
        return "bg-seat-selected";
      case "booked":
        return "bg-seat-booked cursor-not-allowed";
      default:
        return "bg-seat-available";
    }
  };

  // ✅ Navigate to receipt page with booking details
  const handleProceedToPayment = () => {
    navigate("/receipt", {
      state: {
        movieTitle: "Avengers: Endgame",
        theater: "PVR Cinemas - Mall of India",
        showDate: "Today, Jan 15",
        showTime: "7:30 PM",
        seats: selectedSeats.map((seat) => seat.id),
        totalPrice,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Screen */}
      <div className="mb-8 text-center">
        <div className="bg-gradient-to-b from-accent to-accent/60 h-2 rounded-t-full mx-auto w-80 mb-2"></div>
        <p className="text-muted-foreground text-sm">SCREEN</p>
      </div>

      {/* Seat Map */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="grid gap-4">
          {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(
            (row, rowIndex) => (
              <div key={row} className="flex items-center gap-2">
                <div className="w-8 text-center font-medium text-muted-foreground">
                  {row}
                </div>

                <div className="flex gap-1">
                  {seats
                    .filter((seat) => seat.row === row)
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={seat.status === "booked"}
                        className={`
                          w-8 h-8 rounded-t-lg text-xs font-medium transition-all
                          ${getSeatColor(seat.status)}
                          ${seat.status === "booked" ? "" : "hover:scale-110"}
                        `}
                        title={`${seat.id} - ₹${seat.price}`}
                      >
                        {seat.number}
                      </button>
                    ))}
                </div>

                {/* Price tier indicator */}
                <Badge variant="outline" className="ml-4 text-xs">
                  ₹{rowIndex < 3 ? "200" : rowIndex < 7 ? "150" : "100"}
                </Badge>
              </div>
            )
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-seat-available rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-seat-selected rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-seat-booked rounded"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Booking Summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-card rounded-lg p-4 border border-primary/20">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold">Selected Seats</h3>
              <p className="text-sm text-muted-foreground">
                {selectedSeats.map((seat) => seat.id).join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">₹{totalPrice}</p>
              <p className="text-sm text-muted-foreground">
                {selectedSeats.length} seat(s)
              </p>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
