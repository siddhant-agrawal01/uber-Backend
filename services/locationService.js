import redisClient from "../utils/redisClient.js"

class LocationService {

    async setDriverSocket(driverId, socketId) {
        await redisClient.set(`driver:${driverId}`, socketId)
    }

    async getDriverSocket(driverId) {
        return await redisClient.get(`driver:${driverId}`)
    }
    async deleteDriverSocket(driverId){
        return await redisClient.del(`driver:${driverId}`)
    }
}

export default new LocationService()