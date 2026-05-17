import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator,
         addMemberToProjectValidator
       } from "../validators/index.js";
import { verifyJWT , validateProjectPermissions } from "../middlewares/auth.middleware.js";
import {
    getProject,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMemberToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMemberRole,
        } from "../controllers/project.controllers.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";


const router = Router();

router.use(verifyJWT);

router.route("/")
    .get(getProject)
    .post(createProjectValidator(),validate, createProject)
router.route("/:projectId")
    .get(validateProjectPermissions(AvailableUserRoles), getProjectById)
    .put(validateProjectPermissions([UserRolesEnum.ADMIN]),createProjectValidator(),validate, updateProject)
    .delete(validateProjectPermissions([UserRolesEnum.ADMIN]), deleteProject)


router
    .route("/:projectID/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermissions([UserRolesEnum.ADMIN])
        ,addMemberToProjectValidator()
        ,validate
        ,addMemberToProject
    )
router
    .route("/:projectID/members/:userId")
    .put(validateProjectPermissions([UserRolesEnum.ADMIN]), updateMemberRole)
    .delete(validateProjectPermissions([UserRolesEnum.ADMIN]), deleteMemberRole)

export default router;

