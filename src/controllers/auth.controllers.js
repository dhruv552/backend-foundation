import { User } from '../models/user.models.js';
import { apiResponse } from '../utils/api-response.js';
import asyncHandler from "../utils/async-handler.js";
import { apiError } from '../utils/api-error.js';
import { emailVerificationMailgenContent, sendEmail } from '../utils/mail.js';
import jwt from 'jsonwebtoken';

const generateAccessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }


    } catch (error) {
        throw new apiError(500, "Failed to generate access and refresh tokens")

    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { email, username, password, role, FullName, fullName } = req.body
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existedUser) {
        throw new apiError(409, "User with the provided email or username already exists.")
    }
    const name = FullName ?? fullName ?? username
    const user = await User.create({
        email,
        username,
        FullName: name,
        password,
        isEmailVerified: false,

    })



    const { unHashedToken, hashedToken, hashedTokenExpiration } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken
    user.emailVerificationTokenExpiration = hashedTokenExpiration;
    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Email Verification for Project Management App",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email?token=${unHashedToken}`
        )

    })
    const CreatedUser = await User
        .findById(user._id)
        .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    if (!CreatedUser) {
        throw new apiError(500, "Something went wrong while creating the user. Please try again.")
    }
    return res
        .status(201)
        .json(new apiResponse(201, "User registered successfully. Please check your email to verify your account.",

            { user: CreatedUser }
        ))


})

const login = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body
    if (!email && !username) {
        throw new apiError(400, "Please provide either email or username to login.")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (!user) {
        throw new apiError(404, "User not found with the provided email or username.")
    }
    const isPassowrdValid = await user.isPasswordCorrect(password)
    if (!isPassowrdValid) {
        throw new apiError(401, "Invalid password. Please try again.")
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)

    const loggedInUser = await User
        .findById(user._id)
        .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    const options = {
        httpOnly: true,
        secure: false,
    }
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new apiResponse(200, "User logged in successfully",
            {
                user: loggedInUser
                , accessToken
                , refreshToken
            }))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: ""
        }
    },
    {
        new: true,

    }
)
 const options = {
        httpOnly: true,
        secure: false,}
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"))
    
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new apiResponse(200, req.user, "Current user retrieved successfully"))
})

const verifyEmail = asyncHandler(async (req, res) => {
    const {verificationtoken} = req.query
    if (!verificationtoken) {
        throw new apiError(400, "Email Verification token is missing.")
    }

    let hashedToken = crypto
    .createHash("sha256")
    .update(verificationtoken)
    .digest("hex")

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiration: { $gt: Date.now() }
    })

    if (!user) {
        throw new apiError(400, "Invalid or expired email verification token.")
    }
    user.isEmailVerified = true

    user.emailVerificationToken = undefined
    user.emailVerificationTokenExpiration = undefined
    await user.save({validateBeforeSave: false})
    return res
    .status(200)
    .json(new apiResponse(
        200, {}, "Email verified successfully. You can now login to your account."))

})

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user){
        throw new apiError(404, "User does not exist.")
    }
    if (user.isEmailVerified) {
        throw new apiError(409, "Email is already verified.")
    }

    const { unHashedToken, hashedToken, hashedTokenExpiration } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken
    user.emailVerificationTokenExpiration = hashedTokenExpiration;
    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Email Verification for Project Management App",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email?token=${unHashedToken}`
        )

    })
    return res
    .status(200)
    .json(new apiResponse(200, {}, "Verification email resent successfully. Please check your email to verify your account."))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized request, no refresh token provided.")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if (!user){
            throw new apiError(401, "Ivalid refresh token.")
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw new apiError(401, "Refresh token is Expired")
        }
        const option = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)

        user.refreshToken = refreshToken
        await user.save()
        return res
        .status(200)
        .cookie("refreshToken", refreshToken, option)
        .cookie("accessToken", accessToken, option)
        .json(
            new apiResponse
                (200, 
                { accessToken, refreshToken }, 
                "Access token refreshed successfully"
               )
            )

    } catch (error) {
        throw new apiError(401, "Invalid refresh token.")
    }
})



// const getCurrentUser = asyncHandler(async (req, res) => {})

export {
    registerUser, 
    generateAccessandRefreshTokens, 
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken
    
}


