
import { io } from "../index.js"
import bookingService from "../services/bookingService.js"
import locationService from "../services/locationService.js"


const createBooking = (io) => {
    async (req, res) => {
        try {
            const { source, destination } = req.body
            //creating booking object new 
            const booking = await bookingService.createBooking({
                passengerId: req.user.id,
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
                        source, destination, fare: booking.fare

                    })
                }
                //ab jin drivers ko noti gaya hai ride ko unko redis mei store bhi krna padega


            }
            //redis mei booking id aur driver ids sotre kara lenge jinke pass noti gyi
            await locationService.storeNotifiedDrivers(booking._id, driverIds)
            return res.status(2000).send({ data: booking, sucess: true, error: null, message: "Booking created successfully" })

        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}

export default {
    createBooking
}
