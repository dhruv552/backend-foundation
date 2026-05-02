import { User } from '../models/user.models.js';
import { apiResponse } from '../utils/api-response.js';
import asyncHandler from "../utils/async-handler.js";
import { apiError } from '../utils/api-error.js';
import { emailVerificationMailgenContent, sendEmail } from '../utils/mail.js';

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
        .json(new apiResponse(200, "User registered successfully. Please check your email to verify your account.",

            { user: CreatedUser }
        ))
         

})

const login = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body
    if (!email || !username) {
        throw new apiError(400, "Please provide either email or username to login.")
    }

    const user =  await User.finedOne({email})
    if (!user){
        throw new apiError(404, "User not found with the provided email.")
    }
    const isPassowrdValid = user.isPasswordCorrect(password)
    if (!isPassowrdValid) {
        throw new apiError(401, "Invalid password. Please try again.")

    }
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)

    const loggedInUser = await User
    .findById(user._id)
    .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    const options ={
        httpOnly: true,
        secure: true,
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

export { registerUser, generateAccessandRefreshTokens, login }


