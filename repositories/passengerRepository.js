import User from "../models/user.js"


const findPassengerById = async (passengerId) => {
    return User.findOne({
        _id: passengerId,
        role: "passenger"
    })
}

export default { findPassengerById }