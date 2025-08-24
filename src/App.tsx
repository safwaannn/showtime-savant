import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import Admin from "./pages/Admin";
import SeatSelection from "./pages/SeatSelection";
import NotFound from "./pages/NotFound";
import Theaters from "@/components/ui/Theater";
import SignIn from "./components/ui/signIn";
import SignUp from "./components/ui/SignUp";
import BookingReceipt from "./components/ui/BookingRecipt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/theaters" element={<Theaters />} />
          <Route path="/receipt" element={<BookingReceipt />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/movie/:id/seats" element={<SeatSelection />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
