import bookingRepostory from "../repositories/bookingRepository"

import passengerRepository from "../repositories/passengerRepository"
const getPassengerBookings = async (passengerId) => {
    try {
        const passengerDetails = passengerRepository.findPassengerById(passengerId)
        if (!passengerDetails) throw new Error("passenger not found")
        return passengerDetails
    } catch (error) {

    }
}


const provideFeedback = async (passengerId, bookingId, rating, feedback) => {
    //ek booking k liye feedback provide krna hai to pehle booking ko to fetch krna hoga na 

    const booking = await bookingRepostory.findBooking({
        _id: bookingId,
        passenger: passengerId
    })

    if (!booking) throw new Error("booking not found")

    //agar booking mil gyi to usme rating and feedback store kr denge
    booking.rating = rating
    booking.feedback = feedback

    await booking.save()


}

export default { getPassengerBookings, provideFeedback }

