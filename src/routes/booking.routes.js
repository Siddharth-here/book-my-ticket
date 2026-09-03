import { Router, Router } from "express";

import { bookSeats, getMyBookings } from "../controllers/booking.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router()

router.post('/book', authenticate, bookSeats)
router.get('/my-bookings', authenticate, getMyBookings)

export default router