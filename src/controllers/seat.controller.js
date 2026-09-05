// src/controllers/seat.controller.js
import { seats } from "../db/pool.js";

export const getSeats = async (req, res) => {
  return res.status(200).json(seats);
};

export const bookSeat = async (req, res) => {
  const seatId = parseInt(req.params.id, 10);
  const name = req.user?.name || req.params.name;
  const userId = req.user?.userId;

  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({ error: { message: "Seat not found" } });
  }

  // Prevent duplicate booking
  if (seat.isbooked === 1) {
    return res.status(409).json({ error: { message: "Seat already booked" } });
  }

  // Book seat and link with user
  seat.isbooked = 1;
  seat.name = name;
  seat.user_id = userId;

  return res.status(200).json({
    message: "Seat successfully booked",
    seat
  });
};