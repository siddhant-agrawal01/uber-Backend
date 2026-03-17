import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import bookingController from "../controllers/bookingController.js"

export default (io) => {
    const router = express.Router()
    
    router.post('/', authMiddleware, bookingController.createBooking(io))
    router.post('/confirm', authMiddleware, bookingController.confirmBooking(io))
    
    return router
}
