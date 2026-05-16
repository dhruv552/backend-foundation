import {body} from 'express-validator';
import { AvailableUserRoles } from '../utils/constants';

const userRegisterValidator = ( ) => {

    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Email is not valid!"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required!")
        .isLength({min: 3})
        .withMessage("Username must be at least 3 characters long!"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required!")
        .withMessage("Password must contain at least one lowercase letter!")
        .isLength({min: 8})
        .withMessage("Password must be at least 6 characters long!"),
        body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required!")
        .isLength({min: 3})
        .withMessage("Full name must be at least 3 characters long!"),
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage("Email is not valid!"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required!")
        .isLength({min: 8})
        .withMessage("Password must be at least 8 characters long!"),
    ]
        
    
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required!"),
        body("newPassword")
        .notEmpty()
        .withMessage("New password is required!")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Email is not valid!"),
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("New password is required!")
        .isLength({min: 8})
        .withMessage("New password must be at least 8 characters long!"),
    ]
}

const createProjectValidator = () => {
    return [
        body("name")
        .notEmpty()
        .withMessage("Project name is required!"),
        body("description")
        .optional()

    ]
}

const addMemberToProjectValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Email is not valid!"),
        body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required!")
        .isIn(AvailableUserRoles)
        .withMessage("Role is Invalid!"),
    ]
}

export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator
}