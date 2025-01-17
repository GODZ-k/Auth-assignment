import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getEnv from "../config/envConfig.js";



const hash_rounds = 10

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

}, { timestamps: true })




//  hash user password -------

userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, hash_rounds)

    next()
})


// compare user password -----

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


// generate access token and refresh token

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role },
        getEnv.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: getEnv.ACCESS_TOKEN_EXPIRY }
    )
}



userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id, role: this.role
    }, getEnv.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: getEnv.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateResetPasswordToken = function () {
    return jwt.sign({
        _id: this._id 
    }, getEnv.VERIFICATION_TOKEN_SECRET_KEY,
        {
            expiresIn: getEnv.VERIFICATION_TOKEN_EXPIRY
        }
    )
}


const User = mongoose.model('User', userSchema)

export default User