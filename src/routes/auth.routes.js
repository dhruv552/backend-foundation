import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    registerUser, 
    generateAccessandRefreshTokens, 
    login,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword } from "../controllers/auth.controllers.js";
const router = Router();

// unsecured routes, accessible to everyone not required JWT token in the request header

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator() , validate,login);
router.route("/verify-email/:verificationtoken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

// secure route, only accessible to authenticated users requred JWT token in the request header
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(), validate, resetForgotPassword)
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)



export default router;
