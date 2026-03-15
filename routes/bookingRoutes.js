import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { createBooking, confirmBooking } from "../controllers/bookingController.js"

const router = express.Router()
router.post('/', authMiddleware, createBooking(io))
// router.post('/confirm', authMiddleware, confirmBooking(io))

export default router
