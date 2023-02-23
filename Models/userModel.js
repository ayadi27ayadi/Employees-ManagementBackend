import mongoose from "mongoose"
import { soldeDaysByMonth } from "../config/configue.js";
const userSchema = new mongoose.Schema({
        firstName: { 
        type: String,
        required: true
        },
        lastName: { 
        type: String,
        required: true
         },
        email: { 
            type: String,
            required: true,
            unique: true      
        },
        password: { 
            type: String,
            required: true
        },
        role: { 
            type: String, 
            enum:['Super Admin','Director', 'Administration Director', 'Administration Assistant', 'Team Manager', 'Software Engineer'],
            default: 'Software Engineer',
            required: true
        },
        building: { 
            type: [String], 
            enum:['Front-End','Back-End','Full-Stack'], 
            default: null, 
            required: true
        },
        phone: { 
            type: String, 
            default: "0000",
            required: true 
        },
        avatar: { 
            type: String, 
            required: false 
        },
        isActive: { 
            type: Boolean, 
            default: true 
        },
        activationCode: String,
        soldeDays : { 
            type: Number, 
            default: soldeDaysByMonth
        },
        allDaysOff : { 
            type: Number, 
            default: 0
        },
        daysOffSick : { 
            type: Number, 
            default: 0
        }
        

    },
{
    timestamps: true,
  }
  );

export default  mongoose.model('User', userSchema )


