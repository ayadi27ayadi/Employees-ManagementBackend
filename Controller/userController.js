import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import dayjs from "dayjs";
import {nodeMailer} from "../nodemailer.js";
import {JWT_SECRET, REFRESH_TOKEN_SECRET, RESET_PASSWORD_KEY} from "../config/configue.js"

export const usercontroller={
  // Create new user
    addUser: async (req, res) => {
      const charactersPass = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let generatePassword = '';
      for (let i= 0; i < 6; i++) {
          generatePassword += charactersPass.charAt(Math.floor(Math.random() * charactersPass.length))
      }
  const plainPassword = generatePassword;
  const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let activationCode = "";
  for ( let i=0; i< 25; i++){
    activationCode += characters[Math.floor(Math.random() * characters.length)];
  }
      try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(plainPassword, salt);
        const newUser =  new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: passwordHash,
          building: req.body.building,
          phone: req.body.phone,
          role: req.body.role,
          activationCode: activationCode, 
          avatar : req.body.avatar
        });
         await newUser.save()
         nodeMailer.sendConformationEmail(newUser.email, newUser.activationCode,plainPassword )
        res.send(newUser)
      } catch (err) {
        res.send('user not found')
      }
  },

  //Affiche One User
  getOneUser: async(req, res) => {
    User.find({ _id: req.params.id }, (err, result) => {
      if (!err) {
          res.send(result);
      }
  }).select('-password');
  },


//Affiche All User
  allUser: async (req, res) => {
    let { page, limit, sortBy,createdAt, createdAtBefore, createdAtAfter } = req.query
    if(!page) page=1
    if(!limit) limit=30
    const skip=(page-1)*limit
    const users= await User.find()
                           .sort({ [sortBy]: createdAt })
                           .skip(skip)
                           .limit(limit)
                           .where('createdAt').lt(createdAtBefore).gt(createdAtAfter)
                           .select('-password')
    
     const count= await User.count() //estimatedDocumentCount() or countDocuments()
     res.send({page:page,limit:limit,totalUsers: count, users:users})
},

// Modifier User
updateUser : async(req, res) => {
  try{ 
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, JWT_SECRET); 
    if(decodedToken.role !== "Super Admin"){
    const user= await User.findByIdAndUpdate(req.params.id,{
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    phone : req.body.phone 
    }) 
    await user.save();
    res.status(200).send(user);
    }
    else {
    const user= await User.findByIdAndUpdate(req.params.id, req.body)
    await user.save();
    res.status(200).send(user);
    }
}
catch (err) {    
 res.status(404).send(err)
}
},


//Delete One User
 deleteOneUser: async(req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
},

//Delete All User
deleteAllUser : async (req, res) => {
  try {
    const users = await User.deleteMany( {'role': {$nin:["Super Admin"]}});
    res.status(200).send({ message: `succussffully deleted exepted the super admin` });
}
catch (err) {
    res.status(400).send({ error: `error deleting users ${err}` })
    }
},

// Verify User 
verifyUser: async (req, res) => {
  const newUser = await User.findOne({ activationCode: req.params.activationcode }) 
  newUser.isActive = true  
  newUser.save()
  res.send({ message: "le compte est active avec succes ! ",})
},

// Disabled User 
disableUser: async (req, res) => {
const { id } = req.params
    User.findOne({ _id: id })
        .then(user => {
            if(!user) return res.status(400).json({ error: 'Code is wrong ! ' });
          user.isActive ? (user.isActive = false) :( user.isActive = true) ;
            console.log(user.isActive )
            
            user.save();
            res.status(200).json({ message: 'The account is successfully disactivated' });
        })
        .catch(error => res.status(403).json({ error: 'acces denieted !' }));

},

// Login User
signin: (req, res, next) => {
User.findOne({ email: req.body.email }) 
.then(user => { 
    if (!user) { 
        return res.status(404).json({ error: 'User not found !' }); 
    } 
    if(user.isActive === false) {
        return res.status(401).json({ error: "You can't login ! You are disabled ! "}); 
    }
   bcrypt.compare(req.body.password, user.password) 
    .then(reslt => { 
        if (!reslt) { 
           return res.status(401).json({  error: 'Incorrect password !'});    
        }
        let debutContrat = user.createdAtAfter
        let localDate = dayjs(new Date())
        let diifNowDebut = localDate.diff(debutContrat, 'months')
        let newSoldDays = 2 * diifNowDebut
        user.soldeDays = newSoldDays
        user.save()
        res.status(200).json({ 
            userId: user._id, 
            token: jwt.sign( 
                { userId: user._id , role: user.role}, 
                JWT_SECRET,
                { expiresIn: '23h' }), 
            refreshToken: jwt.sign(
                { userId: user._id , role: user.role}, 
                REFRESH_TOKEN_SECRET,
                { expiresIn: '24h' }
            )   
        });  
        if(user.allDaysOff === 24) {
            console.log("you have finished your leave balance !")
            
        }     
    }) 
    .catch(error => res.status(400).json({ error }));       
})
.catch(error => res.status(500).json({ error }));   
},

// Forgot password
forgotPasswod: async (req, res) => {
  const  {email}  = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({id: oldUser._id , email: oldUser.email}, secret, {
      expiresIn: "24h",
    });
    nodeMailer.sendEmailForgotPassword(oldUser.email,oldUser._id, token)
  res.status(200).json({message:'please check your email for reset your password'})   
     }catch(error){
     res.status(500).json({error}); 
  }
},

// Reset Password 
resetPasswod:async (req, res) => {
  const {password, token} = req.body;
  try {
    const decodedToken = jwt.decode(token)
    const userId = decodedToken.id
    const oldUser = await User.findOne({_id: userId})
 if(!oldUser) {
    return res.status(404).json({error: 'User not found'})
  }
      const encryptedPassword = await bcrypt.hash(password, 10)
      await User.updateOne(
          {_id: userId},
          {$set : {
              password: encryptedPassword
              }
          }
      )
      nodeMailer.resetPasswordEmail(oldUser.email, password)
       res.status(200).json({message: "password updated"})
  } catch (error) {
     res.status(400).json({message: "somthing went wrong!!"})
      }
}





}
  