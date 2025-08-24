-- Create comprehensive movie booking system schema (fixed)

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
  movie_cast TEXT[], -- renamed from cast to movie_cast
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
  locked_until TIMESTAMPTZ,
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

-- Enable Row Level Security
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