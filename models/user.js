import mongoose from " mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: { type: string, required: true },
    email: { type: string, unique: true, required: true },
    password: { type: string, required: true },
    role: { type: string, enum: ['driver', 'passenger'] },
    location: {
        type: {
            type: string,
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