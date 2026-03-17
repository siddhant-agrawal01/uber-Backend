import redisClient from "../utils/redisClient.js"

class LocationService {

    async setDriverSocket(driverId, socketId) {
        await redisClient.set(`driver:${driverId}`, socketId)
    }

    async getDriverSocket(driverId) {
        return await redisClient.get(`driver:${driverId}`)
    }
    async deleteDriverSocket(driverId) {
        return await redisClient.del(`driver:${driverId}`)
    }

    async setPassengerSocket(passengerId, socketId) {
        await redisClient.set(`passenger:${passengerId}`, socketId)
    }

    async getPassengerSocket(passengerId) {
        return await redisClient.get(`passenger:${passengerId}`)
    }

    async deletePassengerSocket(passengerId) {
        return await redisClient.del(`passenger:${passengerId}`)
    }
    //function for finding driver location and adding it to db

    async addDriverLocation(driverId, latitude, longitude) {
        try {
            await redisClient.sendCommand([
                'GEOADD',
                'drivers',
                longitude.toString(),
                latitude.toString(),

                driverId.toString()
            ])
        } catch (error) {
            console.log("cannot add to redis", error)
        }
    }

    async findNearByDrivers(latitude, longitude, radiusKm) {
        const nearByDrivers = await redisClient.sendCommand([
            'GEORADIUS',
            'drivers',
            longitude.toString(),
            latitude.toString(),
            radiusKm.toString(),
            'km',
            'WITHCOORD',
        ])

        //it will return array of drivers with their locations
        return nearByDrivers
    }
    async storeNotifiedDrivers(bookingId, driverIds) {

        for (const driverId of driverIds) {
            await redisClient.sAdd(`notifiedDrivers:${bookingId}`, driverId)

        }
        // let first driverid mili
        //[notifiedDrivers:bkg1=>[1]]
        //fir agr ek aur driver id mili to ek aur add hojaeyga set mei
        //notifiedDrivers:bkg1=>[1,2]
        //agr ek driver accept krega to usko remove kr denge
    }

    async getNotifiedDrivers(bookingId) {
        const nearByDrivers = await redisClient.sMembers(`notifiedDrivers:${bookingId}`)
        return nearByDrivers
    }
}

export default new LocationService()