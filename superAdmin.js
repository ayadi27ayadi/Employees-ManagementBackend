//import { connectDB } from "../Back-End/configuration/connectMongodb.js";
import User from "./Models/userModel.js";
import bcrypt from "bcrypt";
import {nodeMailer} from "./nodemailer.js";
import mongoose from "mongoose";
 import { MONGO_DB_URI } from "./config/configue.js";
//import data from './superAdmin.json' assert {type: "json"}

import { readFileSync } from "fs";
const data = JSON.parse(readFileSync("./superAdmin.json"));

//connectDB ()
console.log(data)

mongoose.connect(MONGO_DB_URI,() => {
    console.log("Connected to MongoDB");
  });

const charactersPass = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let generatePassword = '';
    for (let i= 0; i < 6; i++) {
        generatePassword += charactersPass.charAt(Math.floor(Math.random() * charactersPass.length))
    }
const plainPassword = generatePassword;
console.log(plainPassword) 
const query = User.findOne({ 'role' : 'Super Admin' });
query.select('role')
query.exec( (err, res, next) => {
    if(err) res.status(500).json({ err })
    else {
        if (res) {
            console.log('Super admin is already exist!');
            return process.exit()
        } else {
            bcrypt.hash(plainPassword, 10)
            .then((hashedPassword) => {
                const user = new User({...data, password: hashedPassword})
                console.log("password without hashing",plainPassword) 
                console.log("password with hashing",user.password)
                user.isActive = true
                user.save()
                nodeMailer.sendConformationEmail(user.email,user.activationCode, plainPassword)
                console.log('Super admin is created ' )
                
            }) 
            .catch((err) => console.log(err))
        }
    }
   
})