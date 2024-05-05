import mongoose from "mongoose";

const meetSchema = new mongoose.Schema({
    topic : String,
    type : String,
    student : {type : mongoose.Types.ObjectId, ref : 'user'},
    mentor : {type : mongoose.Types.ObjectId, ref : 'mentor'},
    date : String,
    link : String,
    price : Number,
    startTime : String,
    endTime : String,
    duration : Number,
    approval : Boolean,
    payment : Boolean,
    paymentId : String,
    paymentApproval : Boolean,
})

const meetModel = new mongoose.model('meet', meetSchema);
export default meetModel;