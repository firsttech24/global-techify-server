import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    password : {
        type : String,
        required : true,
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
    },
    countryCode: {
        type: String,
        minlength: 1,
        maxlength: 200
    },
    wnumber: {
        type: Number,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v.toString());
            },
            message: props => `${props.value} is not a valid 10-digit number!`
        },
        required: true
    },
    education: {
        institute: String,
        passingYear: String,
        degree: String,
        department: String,
        specialisation: String,
    },
    profilePhoto: String,
    resume: String,
    areasOfInterest: {
        type: [String],
    },
    socials: [{
        linkedin: String,
        github: String,
        twitter: String
    }],
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);
export default userModel;
