
import driverService from "../services/driverService.js"

export const getDriverBookings = async (req, res) => {
   

}
export const updateLocation = async (req, res) => {

    const { latitude, longitude } = req.body;
    await driverService.updateLocation(req._user._id, { latitude, longitude });

    res.status(201).send({ sucess: true, error: null, message: "Location updated successfully" })
}
