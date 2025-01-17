import { cookieOptions } from "../config/cookie.config.js";
import getEnv from "../config/envConfig.js";
import jwt from 'jsonwebtoken'
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import User from "../model/user.model.js";
import { forgotPasswordSchema, LoginSchema, RegisterSchema, resetPasswordSchema, updateProfileSchema, updateUserRoleSchema } from "../types/auth.types.js";



export default class AuthController {

    // Register a new user
    static Register = asyncHandler(async (req, res, next) => {
        const inputData = req.body

        const payload = RegisterSchema.safeParse(inputData)

        if (!payload.success) {
            return res.status(422).json({
                msg: payload.error.issues[0].message || "Invalid input",
                success: false
            })
        }

        const { email, username, password , confirmPassword } = payload.data

        if (password !== confirmPassword) {
            return res.status(422).json({
                msg: "confirm Password doesn't match",
                success: false
            })
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })

        if (existingUser) {
            return res.status(409).json({
                msg: "User already exists",
                success: false
            })
        }

        const user = await User.create({ email, password, username })

        if (!user) {
            return res.status(500).json({
                msg: "Failed to create user",
                success: false
            })
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save()

        const createdUser = await User.findById(user._id).select('username email role -_id')

        return res.cookie("accessToken", accessToken, cookieOptions).cookie("refreshToken", refreshToken, cookieOptions).status(200).json({
            success: true,
            createdUser,
            accessToken,
            msg: "User registered successfully"

        })
    })

    // Login a user
    static login = asyncHandler(async (req, res, next) => {
        const inputData = req.body

        const payload = LoginSchema.safeParse(inputData)

        if (!payload.success) {
            return res.status(422).json({
                msg: payload.error.issues[0].message || "Invalid input",
                success: false
            })
        }

        const { email, username, password } = payload.data

        const user = await User.findOne({ $or: [{ email }, { username }] })

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                msg: "Invalid credentials",
                success: false
            })
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save()

        const loggedInUser = await User.findById(user._id).select('username email role -_id')

        return res.cookie("accessToken", accessToken, cookieOptions).cookie("refreshToken", refreshToken, cookieOptions).status(200).json({
            success: true,
            msg: "User logged in successfully",
            accessToken,
            loggedInUser
        })
    })

    // Logout a user
    static logout = asyncHandler(async (req, res, next) => {
        const user = req.user


        res.clearCookie("accessToken", cookieOptions)
        res.clearCookie("refreshToken", cookieOptions)

        return res.status(200).json({
            success: true,
            msg: "User logged out successfully"
        })
    })

    // get all registered user
    static AllUsers = asyncHandler(async (req, res, next) => {

        const users = await User.find({}).select("email username role -_id createdAt updatedAt")

        return res.status(200).json({
            success: true,
            msg: "Users found successfully",
            users
        })
    })

    // get user profile
    static profile = asyncHandler(async (req, res, next) => {
        const user = req.user

        const loggedInUser = await User.findById(user._id).select("email username role -_id")

        if (!loggedInUser) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            loggedInUser
        })
    })

    // get user by id
    static getUser = asyncHandler(async (req, res, next) => {
        const userId = req.params.id

        const user = await User.findById(userId).select("email username role updatedAt createdAt -_id")

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            user
        })
    })

    // update user
    static updateUser = asyncHandler(async (req, res, next) => {
        const user = req.user
        const inputData = req.body

        const payload = updateProfileSchema.safeParse(inputData)

        if (!payload.success) {
            return res.status(422).json({
                msg: payload.error.issues[0].message || "Invalid input",
                success: false
            })
        }

        const { email , username } = payload.data

        const existsUser = await User.findById(user._id)

        if (!existsUser) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        
        const updatableData = {}

        if (username) {
            updatableData.username = username
        }
        if (email) {
            updatableData.email = email
        }

        const isExists = await User.findOne({ $or: [{ email }, { username }] }) 

        if (isExists) {
            return res.status(409).json({
                msg: "User already exists",
                success: false
            })
        }
        const updatedUser = await User.findByIdAndUpdate(existsUser._id, updatableData, { new: true }).select("email username role updatedAt createdAt -_id")

        return res.status(200).json({
            success: true,
            msg: "User updated successfully",
            updatedUser
        })
    })

    // change role 
    static changeRole = asyncHandler(async (req, res, next) => {
        const userId = req.params.id
        const inputData = req.body

        const payload = updateUserRoleSchema.safeParse(inputData)

        if (!payload.success) {
            return res.status(422).json({
                msg: payload.error.issues[0].message || "Invalid input",
                success: false
            })
        }

        const { role } = payload.data

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, {role}, { new: true }).select("email username role updatedAt createdAt -_id")

        return res.status(200).json({
            success: true,
            msg: "User updated successfully",
            updatedUser
        })
    })

    // delete user
    static deleteUser = asyncHandler(async (req, res, next) => {
        const userId = req.params.id

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        await User.findByIdAndDelete(userId)

        return res.status(200).json({
            success: true,
            msg: "User deleted successfully"
        })
    })

    // forgot password
    static forgotPassword = asyncHandler(async (req, res, next) => {
        const inputData = req.body

        const payload = forgotPasswordSchema.safeParse(inputData)
        
        if (!payload.success) {
            return res.status(400).json({
                msg: payload.error.issues[0].message || "Invalid input",
                success: false
            })
        }

        const { email } = payload.data
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        const resetToken = user.generateResetPasswordToken()

        if (!resetToken) {
            return res.status(500).json({
                msg: "Failed to reset passworf",
                success: false
            })
        }

        // send email --- ( todo )

        return res.status(200).json({
            success: true,
            resetToken,
            msg: "Password reset link sent to your email"
        })
    })

    // reset password 
    static resetPassword = asyncHandler(async (req, res, next) => {
        const inputData = req.body
        const token = req.query.token

        const payload = resetPasswordSchema.safeParse(inputData)

        if (!payload.success) {
            return res.status(400).json({
                msg: payload.error.issues[0].message || "Invalid input",
                success: false
            })
        }

        const decodeToken = jwt.verify(token, getEnv.VERIFICATION_TOKEN_SECRET_KEY)

        if (!decodeToken) {
            return res.status(400).json({
                msg: "Invalid token",
                success: false
            })
        }

        console.log(decodeToken)
        const { newPassword, confirmPassword } = payload.data

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                msg: "Password doesn't match",
                success: false
            })
        }

        const user = await User.findById(decodeToken._id)

        if (!user) {
            return res.status(404).json({
                msg: "User not found",
                success: false
            })
        }

        user.password = newPassword
        await user.save({ validateBeforeSave: false })

        return res.status(200).json({
            success: true,
            msg: "Password updated successfully"
        })

    })

}