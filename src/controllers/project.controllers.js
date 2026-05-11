import { apiResponse } from '../utils/api-response.js';
import asyncHandler from "../utils/async-handler.js";
import { apiError } from '../utils/api-error.js';
import { Project } from '../models/project.models.js';
import { ProjectMember } from '../models/projectmember.models.js';
import { User } from '../models/user.models.js';

const getProject = asyncHandler(async (req, res) => {
     // test
})

const getProjectById = asyncHandler(async (req, res) => {
    // test
})

const createProject = asyncHandler(async (req, res) => {
    // test
})

const updateProject = asyncHandler(async (req, res) => {
    // test
})

const deleteProject = asyncHandler(async (req, res) => {
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



