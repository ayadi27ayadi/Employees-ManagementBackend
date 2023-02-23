import { JWT_SECRET, maxDaysByMonth , soldDaysOffSick, soldDaysByYear} from "../config/configue.js";
import DayOff from "../Models/dayOffModel.js";
import User from "../Models/userModel.js"
import jwt from "jsonwebtoken";
import dayjs from 'dayjs';

export const dayoffcontroller={
  // Add Day Off
  AddDayOff: async (req,res) =>{
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
    const userId = decodedToken.userId
    try {
        let newDaysOff = new DayOff({
            userId : userId,
            startDay: req.body.startDay,
            endDay: req.body.endDay,
            type: req.body.type,
            JustificationSick: req.body.JustificationSick
        });
        let startDay = dayjs(newDaysOff.startDay)
        let endDay = dayjs(newDaysOff.endDay)
        let reqDay = endDay.diff(startDay, 'days')
        if(reqDay > maxDaysByMonth) {
            return res.status(201).send({ message : "maximum 10 days"})
        }
        newDaysOff.reqDayOff = reqDay
        await newDaysOff.save();
        return res.status(200).send({ message: `your request is succussffully added and the id of it ${newDaysOff._id} ` });
    }
    catch (err) {
        res.status(400).send({ error: `error adding new Days Off ${err}` })
        }
},


  //Affiche One Day Off 
  getOneDayOff: async(req, res) => {
    DayOff.find({ _id: req.params.id }, (err, result) => {
      if (!err) {
          res.send(result);
      }
  });
  },

  //Affiche Day Off Of The User 
  getAllDayOffUser: async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET); 
    const userReqId = decodedToken.userId;
    const verifUser = DayOff.userId = userReqId
    let { page, limit, sortBy,createdAt, createdAtBefore, createdAtAfter } = req.query   
    if(!page) page=1
    if(!limit) limit=30
    const skip=(page-1)*limit
    const daysOffList= await DayOff.find({ userId : verifUser })
    .sort({ [sortBy]: createdAt })
    .skip(skip)
    .limit(limit)
    .where('createdAt').lt(createdAtBefore).gt(createdAtAfter)
    const count= await DayOff.count()
    res.send({page:page,limit:limit,totalDaysOff: count, daysOff:daysOffList})
},
// Delete One Day Off
deleteDaysOff : async (req, res) => {
    const {id} = req.params;
    const dayOff = await DayOff.findOne({_id: id})
    if(!dayOff) {
        return res.status(401).json({ error: 'Request not found or you are disabled now!' }); 
    }
    if(dayOff.statusDecision === true) {
        return res.status(401).json({ error: 'you can not remove this request !' }); 
    }
    try {
        const dayOffDel = await DayOff.findByIdAndDelete(req.params.id)  
        res.status(200).send({ message: `${dayOffDel.id} is succussffully deleted` });
    }
    catch (error) {
        res.json({message: "error deleting !"})
        }
  } ,
  // Delete all request
   deleteAllDaysOff : async(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]; 
        const decodedToken = jwt.verify(token, JWT_SECRET); 
        const userReqId = decodedToken.userId;
        const verifUser = DayOff.userId = userReqId
        const dayoff = DayOff.find({ userId : verifUser })
        if(!dayoff){
            return res.status(404).json({error:`Request not found or you are disabled now! `})
        }
        if(dayoff.statusDecision === true){
            return res.status(401).json({error:`you can not remove all request!`})
        }
        else {
            await DayOff.deleteMany(dayoff)
        }
        return res.status(200).send({message:`All DayOff are succussffully deleted`})
    }
    catch(err){
        res.status(500).json({message:`error deleting!`})
    }
  },

// Update Day Off

updateDayOff : async (req, res) => {
    if(!req.body){
        return res.status(503).send({message:`Day off can not update, be empty!`})
    }
    const {id} = req.params;
    DayOff.findOne({_id: id})
    .then(dayoff => {
        if(!dayoff){ 
            return res.status(404).json({ error: 'Request not found !' }); } 

        if(dayoff.statusDecision === true){
            res.status(503).json({error:`you can't update this request`})}    
        });

    try {
            const daysOffs = await DayOff.findByIdAndUpdate(req.params.id,req.body );    
            let startDay = dayjs(daysOffs.startDay)
            let endDay = dayjs(daysOffs.endDay)
            let reqDay = endDay.diff(startDay, 'days')
            if(reqDay > maxDaysByMonth) {
                return res.status(201).send({ message : "maximum 10 days"})
            }
            daysOffs.reqDayOff = reqDay
            await daysOffs.save()
            res.status(200).send({ message: `${daysOffs.id} is succussffully updated` });
         }
    catch (error) {
        res.status(500).json({err:`err`}); 
    }
    
},
// Decision Day Off Request
 UpdateDayOffDecision : async (req, res) => {
  const { id } = req.params
  const idReq = await DayOff.findOne({_id: id})
  if(!idReq) {
      return res.status(404).json({error: 'Request not found'})
  }
  try {
      const token = req.headers.authorization.split(' ')[1]; 
      const decodedToken = jwt.verify(token, JWT_SECRET); 
      const userId = decodedToken.userId; 
      if(decodedToken.role === "Director"){
          await DayOff.findByIdAndUpdate(
              {_id: id},
              {$set : {
                  "decisionDirector.userIdDir": userId,
                  "decisionDirector.Status": req.body.Status,
                  "decisionDirector.JustificationDir": req.body.JustificationDir
              }
          }
              
          )
      }
      if(decodedToken.role === "Team Manager"){
          await DayOff.findByIdAndUpdate(
              {_id: id},
              {$set : {
                  "decisionManager.userIdMan": userId,
                  "decisionManager.Status": req.body.Status,
                  "decisionManager.JustificationMan": req.body.JustificationMan
              }
          }    
          ) 
      }
      
      await DayOff.findByIdAndUpdate(
          {_id: id},
          {$set : {
              "statusDecision" : true
              }
          }
      )
     return  res.status(200).send({ message: `user with id = ${userId} ,your answer is succussffully send` });
       next()
  
  }
  catch (err) {
      return res.status(503).json({ error: `error send answer of this Days Off ${err}` })
  }
  },


//the status of request Accepted or Declined
 statusReq : async ( req, res) => {
    const { id } = req.params
    const idReq = await DayOff.findOne({_id: id})
    const idUser = idReq.userId
    let user = await User.findOne({_id: idUser})
    let oldSoldDays = user.soldeDays
    let statusMan = idReq.decisionManager.Status
    let statusDir = idReq.decisionDirector.Status
    let reqDays = idReq.reqDayOff
    let oldSoldSick = user.daysOffSick
    if(statusDir && statusMan === true){
        await DayOff.findByIdAndUpdate(
            {_id: id}, 
            {$set : {
                "statusReq" : true
            }}
        )
        if(idReq.JustificationSick != null && user.daysOffSick < soldDaysOffSick) {
            await DayOff.findByIdAndUpdate(
                {_id: id}, 
                {$set : {
                    "type" : `Sick`
                }}
            )
            await User.findByIdAndUpdate( 
                {_id: idUser},
                {$set : {
                    "daysOffSick" : oldSoldSick + reqDays 
                    
                    }
                }
            )
        }
        let allDaysOff = user.allDaysOff + reqDays
        if(allDaysOff > soldDaysByYear) {
            await DayOff.findByIdAndUpdate(
                {_id: id}, 
                {$set : {
                    "type" : `Unpaid`
                    }
                }
            )
        }
        let newSoldDays = oldSoldDays - reqDays
        await User.findByIdAndUpdate( 
            {_id: idUser},
            {$set : {
                "soldeDays" : newSoldDays
                }
            }
        )
        if(idReq.type != 'Sick')
        await User.findByIdAndUpdate( 
            {_id: idUser},
            {$set : {
                "allDaysOff": allDaysOff
                }
            }
        )
    }  
}

}
  