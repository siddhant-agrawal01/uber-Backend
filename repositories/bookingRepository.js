import Booking from "../models/booking.js"

const findBooking = async (criteria) => {
    return await Booking.findOne(criteria)
}

const createBooking = async (bookingData) => {
    const booking = new Booking(bookingData);
    await booking.save();
    return booking;
}

const updateBookingStatus = async (bookingId, driverId, status) => {
    return await Booking.findByIdAndUpdate(
        bookingId, 
        { driver: driverId, status: status }, 
        { new: true }
    );
}

export default { findBooking, createBooking, updateBookingStatus }