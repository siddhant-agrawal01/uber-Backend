
// import { io } from "../index.js"
import bookingService from "../services/bookingService.js"
import locationService from "../services/locationService.js"


const createBooking = (io) => async (req, res) => {
    try {
        const { source, destination } = req.body
        //creating booking object new 
        const booking = await bookingService.createBooking({
            passengerId: req.user._id,
            source,
            destination
        })

        //ab nearby drivers ko find krenge
        const nearByDrivers = await bookingService.findNearByDrivers(source);

        //jis jis driver ko noti jayega unki ids ko is array me store karlenge 
        //kyuki jab remove krna hoga to un drivers ki id pata honi chaiye
        const driverIds = []
        //ab har ek driver pe iterate krnege
        //har ek driver jo mujhe nearBy drivers mei mila hai 
        //unsabko noti jaygi
        //noti k liye un drivers ki socket id pata honi chaiye
        //socket id hume redis se pata chalegi

        for (const driver of nearByDrivers) {
            //getsocketId
            //emit notification
            const driverSocketId = await locationService.getDriverSocket(driver[0])

            if (driverSocketId) {
                //driver to bhot hai lekin access to ek hi kar payega koi
                //baaki bache walo ki mei se noti remove krdenge
                driverIds.push(driver[0])
                io.to(driverSocketId).emit('newBooking', {
                    bookingId: booking._id,
                    source,
                    destination,
                    fare: booking.fare
                })
            }
            //ab jin drivers ko noti gaya hai ride ko unko redis mei store bhi krna padega


        }
        //redis mei booking id aur driver ids sotre kara lenge jinke pass noti gyi
        await locationService.storeNotifiedDrivers(booking._id, driverIds)
        return res.status(201).send({ data: booking, success: true, error: null, message: "Booking created successfully" })

    } catch (error) {
        res.status(400).send(error.message)
    }
}

const confirmBooking = (io) => async (req, res) => {
    try {
        //first first the booking id
        const { bookingId } = req.body
        //now assign driver to booking
        //we will pass the the id of that driver that accepted the ride
        const booking = await bookingService.assignDriver(bookingId, req.user._id)
        //now after confirmation of ride we will remove remaiing driver from redis

        const notifiedDriverIds = await locationService.getNotifiedDrivers(bookingId)

        // Notify the passenger
        const passengerSocketId = await locationService.getPassengerSocket(booking.passenger.toString())
        if (passengerSocketId) {
            io.to(passengerSocketId).emit('rideconfirmed', { 
                bookingId, 
                driverId: req.user._id,
                fare: booking.fare 
            })
        }

        for (const driverId of notifiedDriverIds) {
            const driverSocketId = await locationService.getDriverSocket(driverId)
            if (driverSocketId) {
                if (driverId == req.user._id.toString()) {
                    io.to(driverSocketId).emit('rideconfirmed', { bookingId, driverId: req.user._id })
                }
                else {
                    //bakkiyo ko remove booking ka message emit hoga
                    io.to(driverSocketId).emit('removeBooking', { bookingId })
                }
            }
        }
        return res.status(200).send({ data: booking, success: true, error: null, message: "Booking confirmed successfully" })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export default {
    createBooking, confirmBooking
}
