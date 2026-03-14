import express, { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { getDriverBookings, updateLocation } from "../controllers/driverController.js"

const router = Router()
router.get('/bookings', authMiddleware, getDriverBookings)
router.post('/location', authMiddleware, updateLocation)

export default router
