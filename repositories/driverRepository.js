import User from "../models/user.js"

 const updateDriverLocation = async (driverId, location) => {
    return await User.findByIdAndUpdate(driverId, location, { new: true })
}

export default updateDriverLocation