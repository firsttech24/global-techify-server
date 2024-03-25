import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50
    },
    password : {
        type : String,
        required : true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    wnumber: {
        type: Number
    },
    education: [{
        institute: String,
        passingYear: String,
        degree: String,
        department: String,
        marks: String,
    }],
    profilePhoto: String,
    resume: String,
    areasOfInterest: {
        type: [String],
    },
    socials: {
        linkedin: String,
        github: String,
        twitter: String
    },
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);
export default userModel;
