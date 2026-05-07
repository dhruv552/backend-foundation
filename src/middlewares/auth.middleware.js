import {User} from '../models/user.models.js';
import { apiError } from '../utils/api-error.js';
import asyncHandler from '../utils/async-handler.js';
import jwt from 'jsonwebtoken';


export const verifyJWT = asyncHandler(async (req, res, next) => {
     
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        return next(apiError(401, "Unauthorized request, no token provided"))
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
        )
        if (!user) {
            throw new apiError(401, "Invalid Acces Token")
        }
        req.user = user
        next()


    } catch (error) {
        throw new apiError(401, "Invalid Acces Token")
    }

})