import { Router } from "express";

import { bookSeat, getSeats } from "../controllers/seat.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router()

router.post('/book', authenticate, bookSeat)
router.get('/my-bookings', authenticate, getSeats)
router.put("/:id/:name", authenticate, bookSeat)
export default router