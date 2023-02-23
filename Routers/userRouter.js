import express from "express";
import {usercontroller} from "../Controller/userController.js"
const router = express.Router();
import { isAuth } from "../Middelware/Auth.js";
import { checkRole } from "../Middelware/checkRole.js";
import validorId from "../Middelware/ValidatorId.js"
import { validateRequestUser } from "../Middelware/validatorRequest.js";

/* Add New User */
router.post('/users',isAuth,(req, res, next)=> checkRole(['Super Admin'], req, res, next), validateRequestUser, usercontroller.addUser)

/* route for displaying the information of a user whose identifier is known */
 router.get("/usersById/:id",isAuth,(req, res, next)=> checkRole(['Super Admin'], req, res, next), validorId, usercontroller.getOneUser);

/* Recupere ALL User */
router.get("/users",isAuth,(req, res, next)=> checkRole(['Super Admin'], req, res, next), usercontroller.allUser);

/* Update User */
router.put("/users/:id", isAuth, (req, res, next)=> checkRole(['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Enginner'], req, res, next), validorId, usercontroller.updateUser);

/* Delete One User */
  router.delete("/users/delete/:id",isAuth,(req, res, next)=> checkRole(["Super Admin"], req, res, next), validorId, usercontroller.deleteOneUser);

/* Delete All User */
 router.delete("/deletealluser", isAuth,(req, res, next)=> checkRole(["Super Admin"], req, res, next), usercontroller.deleteAllUser);

/* Verify user  */
router.post("/verifyuser/:activationcode", usercontroller.verifyUser);

/* Disabled user  */
router.patch("/users/disable/:id", isAuth,(req, res, next)=> checkRole(['Super Admin'], req, res, next), validorId, usercontroller.disableUser);

/* Login */
router.post("/auth/signin", usercontroller.signin);

/* Forgot Password */
router.post("/auth/forgetPassword", usercontroller.forgotPasswod);

/* Reset Password */
router.patch("/auth/requestResetPassword", validorId, usercontroller.resetPasswod);

export default router;