import { apiResponse } from '../utils/api-response.js';
import asyncHandler from "../utils/async-handler.js";
import { apiError } from '../utils/api-error.js';
import { Project } from '../models/project.models.js';
import { ProjectMember } from '../models/projectmember.models.js';
import { User } from '../models/user.models.js';
import mongoose from 'mongoose';

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    })
    await ProjectMember.create(
        {
            user: new mongoose.Types.ObjectId(req.user._id),
            project: new mongoose.Types.ObjectId(project._id),
            role: UserRolesEnum.ADMIN,
        }
    )
    return res
    .status(201)
    .json(
        new apiResponse(
            201,
            project,
            "Project created successfully", 
    )
)
})

const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const {projectId} = req.params;
    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description,},
        {new: true}
        )

    if(!project){
        throw new apiError(404, "Project not found");
    }
    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            project,
            "Project updated successfully", 
    )
)
})

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const project = await Project.findByIdAndDelete(projectId);
    if(!project){
        throw new apiError(404, "Project not found");
    }
    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            project,
            "Project deleted successfully", 
    )
)
})

const getProject = asyncHandler(async (req, res) => {
     // test
})

const getProjectById = asyncHandler(async (req, res) => {
    // test
})

const addMemberToProject = asyncHandler(async (req, res) => {
    // test
})

const getProejctMembers = asyncHandler(async (req, res) => {
    // test
})

const updateMemberRole = asyncHandler(async (req, res) => {
    // test
})

const deleteMemberRole = asyncHandler(async (req, res) => {
    // test
})

export {
    getProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProejctMembers,
    updateMemberRole,
    deleteMemberRole,
}



