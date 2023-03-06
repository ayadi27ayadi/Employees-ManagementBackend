import express from "express";
import {dayoffcontroller} from "../Controller/dayoffController.js";
import { isAuth } from "../Middelware/Auth.js";
import { checkRole } from "../Middelware/checkRole.js";
import validatorId from "../Middelware/ValidatorId.js";
import { validateRequestDaysOff, validateRequestDecision } from "../Middelware/validatorRequest.js"
const router = express.Router();



/* Route for added a new request days off */
router.post("/daysOff", isAuth,(req, res, next)=> checkRole(['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Engineer'], req, res, next),validateRequestDaysOff, dayoffcontroller.AddDayOff);

/* Recupere One Day Off */
 router.get('/daysOff/:id',isAuth,(req, res, next)=> checkRole(['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Engineer'], req, res, next),
 validatorId , dayoffcontroller.getOneDayOff);
 
 /* update One Day Off */
 router.put("/daysOff/:id", isAuth, (req, res, next)=> checkRole(['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Engineer'], req, res, next),
 validatorId  , dayoffcontroller.updateDayOff);
 
 /* update One Day Off */
 router.delete("/delete/:id", isAuth,(req, res, next)=> checkRole(['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Engineer'], req, res, next),
 validatorId , dayoffcontroller.deleteDaysOff);
/* Delet all Day Off Request */
 router.delete("/delete", isAuth,(req, res, next)=> checkRole(['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Engineer'], req, res, next),
 dayoffcontroller.deleteAllDaysOff)
 
 /* Update Decision Day Off */
 router.patch('/daysOff/decision/:id', isAuth,(req, res, next)=> checkRole(['Director','Team Manager'], req, res, next),
  validatorId, validateRequestDecision, dayoffcontroller.UpdateDayOffDecision, dayoffcontroller.statusReq);

  /* get All Day Off to the User */
  router.get("/daysOff",  isAuth, (req, res, next)=> checkRole(['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Engineer'], req, res, next),
  dayoffcontroller.getAllDayOffUser);
export default router;