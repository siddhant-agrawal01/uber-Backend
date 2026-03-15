import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['driver', 'passenger'] },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: { type: [Number], default: [0, 0] }
    }



})

//a presave or pre hook -> before actually saving the password
//  ,it will make sure the password is encrypted
//also if user try to login then it comapre the pw with which is already on the system
//this is a pre save middleware that runs before a document is saved to the db
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next()

})


userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);
export default User