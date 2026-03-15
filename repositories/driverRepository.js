import User from "../models/user.js"

export const updateDriverLocation = async (driverId, location) => {
    return await User.findByIdAndUpdate(driverId, location, { new: true })
}

