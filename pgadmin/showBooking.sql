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
CREATE TABLE theaters (
    theater_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    showtime_id INT REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE,
    theater_id INT REFERENCES theaters(theater_id) ON DELETE CASCADE,
    status booking_status DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    screen_id INT REFERENCES screens(screen_id) ON DELETE CASCADE,
    row_label CHAR(1) NOT NULL,   -- e.g. A, B, C...
    seat_number INT NOT NULL,    -- e.g. 1, 2, 3
    price DECIMAL(10,2) NOT NULL,
    UNIQUE(screen_id, row_label, seat_number)
);

select * from movies;
select * from theaters;
select * from bookings;
select * from users;
select * from seats;

ALTER TABLE bookings
ADD COLUMN movie_id INT REFERENCES movies(movie_id) ON DELETE CASCADE;

ALTER TABLE bookings
ADD COLUMN theater_id INT REFERENCES theaters(theater_id) ON DELETE CASCADE;


SELECT th.*
FROM theaters th
WHERE th.theater_id IN (
    SELECT st.theater_id
    FROM showtimes st
    WHERE st.movie_id = (
        SELECT m.movie_id
        FROM movies m
        WHERE m.title = 'Inception'
    )
);
