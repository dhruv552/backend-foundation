import { apiResponse } from '../utils/api-response.js';
import asyncHandler from "../utils/async-handler.js";
import { apiError } from '../utils/api-error.js';
import { Task } from '../models/task.models.js';
import { SubTask } from '../models/subtask.models.js';
import { User } from '../models/user.models.js';
import mongoose from 'mongoose';
import { AvailableUserRoles, TaskStatusEnum } from '../utils/constants.js'
import { Project } from '../models/project.models.js';


const createTask = asyncHandler(async (req, res) => {
    // Implement logic to create a new task under a specific project
    const { title, description, status, assignedTo } = req.body;
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new apiError(404, "Project not found");
    }
    const files = req.files || [];
    
    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size,
        }
    })
    const task = await Task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments,
    })
    res.status(201).json(
        new apiResponse(
            201, task, "Task created successfully"
        )
    )
})

const getTasks = asyncHandler(async (req, res) => {
    // Implement logic to fetch tasks based on user role and project 
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new apiError(404, "Project not found");
    }
    const tasks = await Task.find({ project: new mongoose.Types.ObjectId(projectId)})
    .populate("assignedTo", "avatar username fullName")
    return res.status(200).json(
        new apiResponse(
            200, tasks, "Tasks fetched successfully"
        )
    )
})

const getTaskById = asyncHandler(async (req, res) => {
    // Implement logic to fetch a specific task by its ID, ensuring the user has access to it
    const { taskId } = req.params;
    const task = await Task.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(taskId),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        _id: 1,
                        username: 1,
                        fullName: 1,
                        avatar: 1,
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "assignedTo",
                            foreignField: "_id",
                            as: "createdBy",
                            pipeline: [
                                {
                                   $project: {
                                    _id: 1,
                                    username: 1,
                                    fullName: 1,
                                    avatar: 1,
                                   }

                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            createdBy: {
                                $arrayElemAt: ["$createdBy", 0],
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElemAt: ["$assignedTo", 0]
                }
            }
        }
    ])
    if (!task || task.length === 0) {
        throw new apiError(404, "Task not found");
    }
    return res.status(200).json(
        new apiResponse(200, task[0], "Task fetched successfully")
    )

})

const updateTask = asyncHandler(async (req, res) => {
    // Implement logic to update a task's details, ensuring the user has permission to do so
})

const deleteTask = asyncHandler(async (req, res) => {
    // Implement logic to delete a task, ensuring the user has permission to do so
}   )

const createSubTask = asyncHandler(async (req, res) => {
    // Implement logic to create a new subtask under a specific task
})

const updateSubTask = asyncHandler(async (req, res) => {
    // Implement logic to update a subtask's details, ensuring the user has permission to do so
})

const deleteSubTask = asyncHandler(async (req, res) => {
    // Implement logic to delete a subtask, ensuring the user has permission to do so
})

export {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
}




