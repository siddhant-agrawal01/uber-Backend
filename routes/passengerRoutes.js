import express from "express"
import authMiddleware from "../middlewares/authMiddleware"
const router = express.Router()

import { getPassengerBookings, provideFeedback } from "../controllers/passengerController.js"

router.post('/bookings', authMiddleware, getPassengerBookings)
router.post('/feedback', authMiddleware, provideFeedback)

export default router