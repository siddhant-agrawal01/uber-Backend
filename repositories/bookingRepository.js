import Booking from "../models/booking"

const findBooking = async (criteria) => {
    return await Booking.findOne(criteria)
}

export default { findBooking }