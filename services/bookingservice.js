import bookingRepository from "../repositories/bookingRepository.js"
import haversineDistance from "../utils/haversine.js"
import locationService from "./locationService.js";
const BASIC_FARE = 50;
const RATE_PER_KM = 12;
const createBooking = async ({ passengerId, source, destination }) => {

    const distance = haversineDistance(source.latitude, source.longitude, destination.latitude, destination.longitude);
    const fare = BASIC_FARE + (distance * RATE_PER_KM);

    const bookingData = {
        passenger: passengerId,
        source,
        destination,
        status: "pending",
        fare,
    }
    const booking = bookingRepository.createBooking(bookingData)
    return booking;
}

const findNearByDrivers = async (location, radius = 5) => {
    const longitude = parseFloat(location.longitude);
    const latitude = parseFloat(location.latitude);
    const radiumKm = parseFloat(radius)

    if (isNaN(longitude) || isNaN(latitude) || isNaN(radiusKm)) {
        throw new Error('Invalid coordinates or radius')
    }
    //saving the driver location to redis cache along with its id
    const nearByDrivers = await locationService.findNearByDrivers(longitude, latitude, radiusKm)

}

const assignDriver = async (bookingId, driverId) => {
    //jo starting mei driver=NULL assign hua the creating booking k time usko update krdenge
    //ye wali driver id se
    const booking = await bookingRepository.updateBookingStatus(bookingId, driverId, 'confirmed')
    if (!booking) throw new Error('Booking not found')
    return booking
}
export default {
    createBooking, findNearByDrivers, assignDriver
}