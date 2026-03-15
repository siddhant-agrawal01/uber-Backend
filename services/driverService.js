

//agar driver ki location update hogi to wo dono jagah hogi 
//mongo and redis mei 
//
import driverRepository from "../repositories/driverRepository.js"
import locationService from "./locationService.js"
export const updateLocation = async (driverId, { latitude, longitude }) => {

    const longitude = parseFloat(location.longitude);
    const latitude = parseFloat(location.latitude);

    if (isNaN(longitude) || isNaN(latitude)) {
        throw new Error('Invalid coordinates or radius')
    }

    await locationService.addDriverLocation(driverId, lat, lon)
    await driverRepository.updateDriverLocation(driverId, { location: { type: "Point", coordinates: [lon, lat] } });
}
