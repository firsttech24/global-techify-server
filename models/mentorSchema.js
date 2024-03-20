import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
    name: String,
    email : String,
    wnumber : Number,
    bio : String,
    profile : String,
    areasOfInterest: [String],
    currentCompany: {
        company: String,
        position: String,
    },
    experience: [{
        company: String,
        position: String,
        startDate: String,
        endDate: String,
    }],
    education: {
        institute: String,
        passingYear: String,
        degree: String,
        department: String,
        specialisation: String,
    },
    socials: [{
        linkedin: String,
        github : String,
        twitter : String
    }],
    pmt : {
        acn : String,
        acno : Number,
        ic : String,
        nb : String,
        bc : String,
        ui : String
    }
});

const mentorModel = mongoose.model('mentor', mentorSchema);
export default mentorModel;
