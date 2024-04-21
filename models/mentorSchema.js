import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    password: { type: String, default: "" },
    email: { type: String, default: "" },
    wnumber: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    profile: { type: String, default: "" },
    approved: { type: Boolean, default: false },
    areasOfInterest: { type: [String], default: [] },
    currentCompany: {
        company: { type: String, default: "" },
        position: { type: String, default: "" }
    },
    experience: [{
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" }
    }],
    education: [{
        institute: { type: String, default: "" },
        passingYear: { type: String, default: "" },
        degree: { type: String, default: "" },
        department: { type: String, default: "" },
        specialisation: { type: String, default: "" }
    }],
    socials: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        twitter: { type: String, default: "" }
    },
    schedule: {
        monday: [{ startingTime: String, endingTime: String }],
        tuesday: [{ startingTime: String, endingTime: String }],
        wednesday: [{ startingTime: String, endingTime: String }],
        thursday: [{ startingTime: String, endingTime: String }],
        friday: [{ startingTime: String, endingTime: String }],
        saturday: [{ startingTime: String, endingTime: String }],
        sunday: [{ startingTime: String, endingTime: String }],
    },
    pmt: {
        acn: { type: String, default: "" },
        acno: { type: Number, default: 0 },
        ic: { type: String, default: "" },
        nb: { type: String, default: "" },
        bc: { type: String, default: "" },
        ui: { type: String, default: "" }
    }
});

const mentorModel = mongoose.model('mentor', mentorSchema);
export default mentorModel;
