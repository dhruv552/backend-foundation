import {User} from '../models/user.models.js';
import { ProjectMember } from '../models/projectmember.models.js';
import { apiError } from '../utils/api-error.js';
import asyncHandler from '../utils/async-handler.js';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";


export const verifyJWT = asyncHandler(async (req, res, next) => {
     
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        return next(new apiError(401, "Unauthorized request, no token provided"))
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

export const validateProjectPermissions =  (roles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { projectId } = req.params;

        if (!projectId) {
            throw new apiError(400, "Project ID is required");
        }

        const project = await ProjectMember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id),
        })

        if (!project){
            throw new apiError(400, "Project Not Found");
        }
        const givenRole = project?.role;
        req.user.role = givenRole;
        if (!roles.includes(givenRole)) {
            throw new apiError(
                403,
                "Forbidden: You don't have permission to access this resource");
        }
        next();
    })

}