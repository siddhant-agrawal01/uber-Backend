import passenger from "./services/passengerService"

const getPassengerBookings = async (req, res) => {
    try {
        const bookings = await passengerService.getPassengerBookings(req.user._id)
        res.status(200).send({
            data: bookings,
            success: true,
            error: null,
            message: "bookings fetched successfully"
        })
    } catch (error) {
        res.status(500).send(error.message);

    }
}

const provideFeedback = async (req, res) => {
    try {
        // req.body will contain bookingId,rating,feedback , so we destrucutre it into three diff variables
        const { bookingId, rating, feedback } = req.body

        passengerService.provideFeedback(req.user._id, bookingId, rating, feedback)

        res.status(200).send({
            data: null,
            success: true,
            error: null,
            message: "feedback provided successfully"
        })

    } catch (error) {

        res.status(500).send(error.message);

    }
}

export default { getPassengerBookings, provideFeedback }