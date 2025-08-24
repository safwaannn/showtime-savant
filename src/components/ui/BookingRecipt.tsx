import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Ticket, Download } from "lucide-react";
import jsPDF from "jspdf";

const BookingReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-6 text-center shadow-lg">
          <p className="text-lg font-medium text-muted-foreground">
            No booking details found.
          </p>
          <Button className="mt-4" onClick={() => navigate("/movies")}>
            Back to Movies
          </Button>
        </Card>
      </div>
    );
  }

  // ✅ Generate PDF receipt
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("🎟 Booking Receipt", 70, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Movie: ${bookingData.movieTitle}`, 20, 40);
    doc.text(`Language: ${bookingData.language}`, 20, 50);
    doc.text(`Theater: ${bookingData.theater || "PVR Cinemas"}`, 20, 60);
    doc.text(`Screen: ${bookingData.screen || "Screen 1"}`, 20, 70);
    doc.text(`Date: ${bookingData.showDate}`, 20, 80);
    doc.text(`Time: ${bookingData.showTime}`, 20, 90);
    doc.text(`Seats: ${bookingData.seats.join(", ")}`, 20, 100);
    doc.text(`Total Amount: ₹${bookingData.totalPrice}`, 20, 110);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for booking with us!", 70, 130);

    doc.save(`BookingReceipt_${bookingData.movieTitle}.pdf`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background p-6">
      <Card className="w-full max-w-md shadow-lg border border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Booking Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Movie Title */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{bookingData.movieTitle}</h2>
            <p className="text-muted-foreground">{bookingData.language}</p>
          </div>

          {/* Theater */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold">
                {bookingData.theater || "PVR Cinemas"}
              </p>
              <p className="text-muted-foreground">
                {bookingData.screen || "Screen 1"}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <p>
              {bookingData.showDate}{" "}
              <span className="text-muted-foreground">
                ({bookingData.day || "Today"})
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <p>{bookingData.showTime}</p>
          </div>

          {/* Seats */}
          <div>
            <p className="font-semibold">Seats:</p>
            <p className="text-muted-foreground">
              {bookingData.seats.join(", ")}
            </p>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center border-t pt-4">
            <p className="font-semibold">Total Amount</p>
            <p className="text-lg font-bold text-primary">
              ₹{bookingData.totalPrice}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => navigate("/movies")}
            >
              Back to Movies
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingReceipt;
