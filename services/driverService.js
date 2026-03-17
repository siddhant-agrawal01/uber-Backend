

//agar driver ki location update hogi to wo dono jagah hogi 
//mongo and redis mei 
//
import driverRepository from "../repositories/driverRepository.js"
import locationService from "./locationService.js"
const updateLocation = async (driverId, { latitude, longitude }) => {
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lon) || isNaN(lat)) {
        throw new Error('Invalid coordinates')
    }

    await locationService.addDriverLocation(driverId, lat, lon)
    await driverRepository.updateDriverLocation(driverId, { 
        location: { type: "Point", coordinates: [lon, lat] } 
    });
}

export default {
    updateLocation
}
