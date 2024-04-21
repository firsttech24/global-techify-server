import mongoose from "mongoose";

const portalSchema = new mongoose.Schema({
    team : [{
        name : String,
        position : String,
        socials : {
            linkedin : String,
            instagram : String,
            twitter : String,
            email : String
        },
        photo : String
    }],
    techifySocials : {
        linkedin : String,
        instagram : String,
        twitter : String,
        email : String,
        phone : String,
    }
})

const portalModel = new mongoose.model("portal", portalSchema);

export default portalModel;