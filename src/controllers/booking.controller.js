import { bookings, movies } from "../db/data.js";

export const bookSeats = (req, res) => {
  const { movieId, seats } = req.body;

  if (!movieId || !Array.isArray(seats) || seats.length === 0) {
    return res
      .status(400)
      .json({
        error: { message: "movieId and an array of seats are required" },
      });
  }

  const movie = movies.find((m) => m.id === movieId);
  if (!movie) {
    return res.status(404).json({ error: { message: "Movie not found" } });
  }

  const takenSeats = bookings
    .filter((b) => b.movieId === movieId)
    .flatMap((b) => b.seats);

  const conflict = seats.some((seat) => takenSeats.includes(seat));
  if (conflict) {
    return res
      .status(409)
      .json({
        error: { message: "One or more selected seats are already booked" },
      });
  }

  const newBooking = {
    id: `bk_${Date.now()}`,
    userId: req.user.id,
    movieId,
    seats,
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  return res.status(201).json({ booking: newBooking });
};

export const getMyBookings = (req, res) => {
  const userBookings = bookings.filter((b) => b.userId === req.user.id);
  return res.status(200).json({ bookings: userBookings });
};
