import mongoose from "mongoose"
const dayOffSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User', 
        required: true
    },
startDay : {
            type: Date,
            required: true
        },
endDay : {
        type: Date,
        required: true
    },
type: {
        type: String,
        enum:["Paid", "Unpaid","Sick"],
        required: true
    },
    decisionDirector: {
        userIdDir: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
        Status: {type: Boolean, default: null},
        JustificationDir: {type: String , default: null}
        },
    decisionManager:{
        userIdMan: {type: mongoose.Schema.Types.ObjectId,ref:'User'}, 
        Status: {type: Boolean, default: null},
        JustificationMan: {type: String , default: null}
        },
statusReq: {
    type: Boolean,
    default:false
},
statusDecision: {
    type: Boolean,
    default:false
},
reqDayOff : { 
    type: Number, 
    default: 0
},
JustificationSick : {
    type: String 
}

  },
{
    timestamps: true,
  }
  );

export default  mongoose.model('DayOff', dayOffSchema )