import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    //default null rakha hai kyuki compuslary nhi ki tumne ride book kari wo accept hojayegi
    //jab driver booking accept krega is when booking enting will change and driver would get associated with it

    driver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null
    },
    source: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    destination: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    fare:Number,
    status:{
        type:String,
        enum:['pending','confirmed','completed','canceled'],default:'pending'
    },
    rating:Number,
    feedback:String


})

//canceled scenario
//booking->pending(by default) --> accepted by driver --> then canceled --> again goes pending(autmatically)
//-->canceled -> if a ride is hunged for pending for n minutes then canceled it completely

