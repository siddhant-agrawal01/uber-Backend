import Booking from "../models/booking.js"

const findBooking = async (criteria) => {
    return await Booking.findOne(criteria)
}

export default { findBooking }