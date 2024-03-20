import mongoose from "mongoose";

const meetSchema = new mongoose.Schema({
    topic : String,
    type : String,
    student : {type : mongoose.Types.ObjectId, ref : 'user'},
    mentor : {type : mongoose.Types.ObjectId, ref : 'mentor'},
    startTime : Date,
    duration : Number,
    approval : Boolean,
    payment : Boolean
})

const meetModel = new mongoose.model('meet', meetSchema);
export default meetModel;