-- ========================
-- ENUM Types (PostgreSQL only, for MySQL use VARCHAR)
-- ========================
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE seat_status AS ENUM ('available', 'selected', 'booked', 'maintenance');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- ========================
-- USERS
-- ========================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- MOVIES
-- ========================
CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTERVAL NOT NULL, -- e.g. '2h 30m'
    language VARCHAR(50),
    rating DECIMAL(3,1), -- IMDb-style rating
    poster_url TEXT,
    release_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- GENRES (Many-to-Many with Movies)
-- ========================
CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE movie_genres (
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- ========================
-- THEATERS
-- ========================
CREATE TABLE theaters (
    theater_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- SCREENS
-- ========================
CREATE TABLE screens (
    screen_id SERIAL PRIMARY KEY,
    theater_id INT REFERENCES theaters(theater_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., "Screen 1"
    total_seats INT NOT NULL
);

-- ========================
-- SHOWTIMES
-- ========================
CREATE TABLE showtimes (
    showtime_id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    screen_id INT REFERENCES screens(screen_id) ON DELETE CASCADE,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- SEATS
-- ========================
CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    screen_id INT REFERENCES screens(screen_id) ON DELETE CASCADE,
    row_label CHAR(1) NOT NULL,   -- e.g. A, B, C...
    seat_number INT NOT NULL,    -- e.g. 1, 2, 3
    price DECIMAL(10,2) NOT NULL,
    UNIQUE(screen_id, row_label, seat_number)
);

-- ========================
-- BOOKINGS
-- ========================
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    showtime_id INT REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
    status booking_status DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- BOOKED SEATS
-- ========================
CREATE TABLE booked_seats (
    booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE,
    seat_id INT REFERENCES seats(seat_id) ON DELETE CASCADE,
    status seat_status DEFAULT 'booked',
    PRIMARY KEY (booking_id, seat_id)
);

-- ========================
-- PAYMENTS
-- ========================
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50), -- e.g. UPI, Card
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- NOTIFICATIONS (Optional)
-- ========================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(50), -- e.g. booking_confirmation, payment_success
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
