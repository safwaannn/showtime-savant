-- Create comprehensive movie booking system schema (FIXED)

-- Create enum types for better data integrity
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE seat_status AS ENUM ('available', 'selected', 'booked', 'maintenance');
CREATE TYPE notification_type AS ENUM ('booking_confirmation', 'payment_success', 'show_reminder', 'cancellation', 'promotion');

-- Theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  amenities TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Screens table (halls within theaters)
CREATE TABLE public.screens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theater_id UUID NOT NULL,
  name TEXT NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 0,
  screen_type TEXT DEFAULT 'Standard',
  sound_system TEXT DEFAULT 'Dolby Digital',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (theater_id) REFERENCES public.theaters(id) ON DELETE CASCADE
);

-- Movies table (enhanced from existing structure)
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  release_date DATE,
  rating DECIMAL(3, 1),
  certificate TEXT, -- PG, PG-13, R, etc.
  language TEXT DEFAULT 'English',
  genre TEXT[],
  director TEXT,
  movie_cast TEXT[], -- Fixed: was "cast" which is reserved
  poster_url TEXT,
  trailer_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Showtimes table
CREATE TABLE public.showtimes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL,
  screen_id UUID NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available_seats INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES public.screens(id) ON DELETE CASCADE
);

-- Seats table
CREATE TABLE public.seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  screen_id UUID NOT NULL,
  row_label TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  seat_type TEXT DEFAULT 'Standard', -- Standard, Premium, VIP
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (screen_id) REFERENCES public.screens(id) ON DELETE CASCADE,
  UNIQUE(screen_id, row_label, seat_number)
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  showtime_id UUID NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  booking_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (showtime_id) REFERENCES public.showtimes(id) ON DELETE CASCADE
);

-- Booking seats (junction table)
CREATE TABLE public.booking_seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  seat_id UUID NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES public.seats(id) ON DELETE CASCADE,
  UNIQUE(booking_id, seat_id)
);

-- Seat availability (real-time tracking)
CREATE TABLE public.seat_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  showtime_id UUID NOT NULL,
  seat_id UUID NOT NULL,
  status seat_status DEFAULT 'available',
  locked_until TIMESTAMPTZ, -- For temporary holds during booking
  locked_by_user UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (showtime_id) REFERENCES public.showtimes(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES public.seats(id) ON DELETE CASCADE,
  UNIQUE(showtime_id, seat_id)
);

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL,
  payment_method TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  payment_status payment_status DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Update profiles table to include more fields
ALTER TABLE public.profiles 
ADD COLUMN avatar_url TEXT,
ADD COLUMN date_of_birth DATE,
ADD COLUMN preferences JSONB DEFAULT '{}';

-- Enable Row Level Security on all tables
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function for admin checks
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND profiles.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for theaters
CREATE POLICY "Anyone can view active theaters" ON public.theaters
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Admins can manage theaters" ON public.theaters
  FOR ALL USING (public.is_admin());

-- RLS Policies for screens
CREATE POLICY "Anyone can view active screens" ON public.screens
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Admins can manage screens" ON public.screens
  FOR ALL USING (public.is_admin());

-- RLS Policies for movies
CREATE POLICY "Anyone can view active movies" ON public.movies
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Admins can manage movies" ON public.movies
  FOR ALL USING (public.is_admin());

-- RLS Policies for showtimes
CREATE POLICY "Anyone can view active showtimes" ON public.showtimes
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Admins can manage showtimes" ON public.showtimes
  FOR ALL USING (public.is_admin());

-- RLS Policies for seats
CREATE POLICY "Anyone can view active seats" ON public.seats
  FOR SELECT USING (is_active = true);
  
CREATE POLICY "Admins can manage seats" ON public.seats
  FOR ALL USING (public.is_admin());

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());
  
CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());
  
CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());
  
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR ALL USING (public.is_admin());

-- RLS Policies for booking_seats
CREATE POLICY "Users can view their booking seats" ON public.booking_seats
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid())
  );
  
CREATE POLICY "Users can manage their booking seats" ON public.booking_seats
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid())
  );
  
CREATE POLICY "Admins can manage all booking seats" ON public.booking_seats
  FOR ALL USING (public.is_admin());

-- RLS Policies for seat_availability
CREATE POLICY "Anyone can view seat availability" ON public.seat_availability
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated users can update seat locks" ON public.seat_availability
  FOR UPDATE USING (auth.uid() IS NOT NULL);
  
CREATE POLICY "System can manage seat availability" ON public.seat_availability
  FOR ALL USING (public.is_admin());

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid())
  );
  
CREATE POLICY "System can manage payments" ON public.payments
  FOR ALL USING (public.is_admin());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
  
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());
  
CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_theaters_city ON public.theaters(city);
CREATE INDEX idx_theaters_active ON public.theaters(is_active);
CREATE INDEX idx_screens_theater ON public.screens(theater_id);
CREATE INDEX idx_movies_active ON public.movies(is_active);
CREATE INDEX idx_movies_genre ON public.movies USING GIN(genre);
CREATE INDEX idx_showtimes_movie ON public.showtimes(movie_id);
CREATE INDEX idx_showtimes_screen ON public.showtimes(screen_id);
CREATE INDEX idx_showtimes_start_time ON public.showtimes(start_time);
CREATE INDEX idx_seats_screen ON public.seats(screen_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_showtime ON public.bookings(showtime_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_seat_availability_showtime ON public.seat_availability(showtime_id);
CREATE INDEX idx_seat_availability_status ON public.seat_availability(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER theaters_updated_at BEFORE UPDATE ON public.theaters
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
CREATE TRIGGER screens_updated_at BEFORE UPDATE ON public.screens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
CREATE TRIGGER movies_updated_at BEFORE UPDATE ON public.movies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
CREATE TRIGGER showtimes_updated_at BEFORE UPDATE ON public.showtimes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
CREATE TRIGGER seats_updated_at BEFORE UPDATE ON public.seats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
CREATE TRIGGER seat_availability_updated_at BEFORE UPDATE ON public.seat_availability
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Function to generate unique booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Function to create seat availability for new showtimes
CREATE OR REPLACE FUNCTION public.create_seat_availability_for_showtime()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.seat_availability (showtime_id, seat_id, status)
  SELECT NEW.id, seats.id, 'available'
  FROM public.seats
  WHERE seats.screen_id = NEW.screen_id AND seats.is_active = true;
  
  -- Update available seats count
  UPDATE public.showtimes 
  SET available_seats = (
    SELECT COUNT(*) FROM public.seats 
    WHERE screen_id = NEW.screen_id AND is_active = true
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_seat_availability AFTER INSERT ON public.showtimes
  FOR EACH ROW EXECUTE FUNCTION public.create_seat_availability_for_showtime();

-- Function to update available seats count when booking changes
CREATE OR REPLACE FUNCTION public.update_available_seats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update seat availability status
  IF NEW.booking_status = 'confirmed' THEN
    UPDATE public.seat_availability
    SET status = 'booked'
    WHERE showtime_id IN (
      SELECT showtime_id FROM public.bookings WHERE id = NEW.id
    ) AND seat_id IN (
      SELECT seat_id FROM public.booking_seats WHERE booking_id = NEW.id
    );
  ELSIF NEW.booking_status = 'cancelled' THEN
    UPDATE public.seat_availability
    SET status = 'available', locked_until = NULL, locked_by_user = NULL
    WHERE showtime_id IN (
      SELECT showtime_id FROM public.bookings WHERE id = NEW.id
    ) AND seat_id IN (
      SELECT seat_id FROM public.booking_seats WHERE booking_id = NEW.id
    );
  END IF;
  
  -- Update available seats count in showtimes
  UPDATE public.showtimes
  SET available_seats = (
    SELECT COUNT(*)
    FROM public.seat_availability
    WHERE showtime_id = NEW.showtime_id AND status = 'available'
  )
  WHERE id = NEW.showtime_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_available_seats AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_available_seats();

-- Enable realtime for critical tables
ALTER TABLE public.seat_availability REPLICA IDENTITY FULL;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.seat_availability;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;