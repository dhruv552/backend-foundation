import mongoose, { Schema } from "mongoose";
import {AvailableRoles,UserRolesEnum } from "../utils/constants.js";

const projectMemberSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Project:{
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    role:{
        type: String,
        enum: AvailableRoles,
        default: UserRolesEnum.MEMBER,  
    }
},
{timestamps: true,})

export const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

