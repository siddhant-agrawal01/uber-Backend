import Booking from "../models/booking.js"

const findBooking = async (criteria) => {
    return await Booking.findOne(criteria)
}
const createBooking = async (bookingData) => {
    const booking = new Booking(bookingData);
    await booking.save();
    return booking;
}
export default { findBooking,createBooking }