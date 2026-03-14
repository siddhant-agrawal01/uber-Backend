import User from "../models/user"


const findPassengerById = async (passengerId) => {
    return User.findOne({
        _id: passengerId,
        role: "passenger"
    })
}

export default { findPassengerById }