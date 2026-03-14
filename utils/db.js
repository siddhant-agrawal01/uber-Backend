import mongoose from "mongoose"

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongo Db connected");
    } catch (error) {
        console.error("MongoDb connection Error", error);
        process.exit(1);
    }
}

export default connectDB