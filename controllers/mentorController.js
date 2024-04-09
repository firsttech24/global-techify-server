import mentorModel from "../models/mentorSchema.js";

const updateMentor = async (req, res) => {
    const mentorId = req.params.id;

    try {
        const mentor = await mentorModel.findById(mentorId);

        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        const {
            name,
            email,
            wnumber,
            bio,
            profile,
            areasOfInterest,
            currentCompany,
            experience,
            education,
            socials,
            approved,
            schedule,
            pmt
        } = req.body;

        mentor.name = name;
        mentor.email = email;
        mentor.wnumber = wnumber;
        mentor.bio = bio;
        mentor.profile = profile;
        mentor.areasOfInterest = areasOfInterest;
        mentor.currentCompany = currentCompany;
        mentor.experience = experience;
        mentor.education = education;
        mentor.socials = socials;
        mentor.pmt = pmt;
        mentor.approved = approved;
        mentor.schedule = schedule;

        const updatedMentor = await mentor.save();

        res.status(200).json(updatedMentor);
    } catch (error) {
        res.status(500).json({ message: "Failed to update mentor", error: error.message });
    }
};


const getAllMentors = async (req, res) => {
    try {
        const all = await mentorModel.find();
        res.status(200).json({ all: all });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getApprovedMentors = async (req, res) => {
    try {
        const all = await mentorModel.find({ approved: true });
        res.status(200).json({ all: all });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getSingleMentor = async (req, res) => {
    const mentorId = req.params.id;
    try {
        const mentor = await mentorModel.findById(mentorId);
        if (!mentor) {
            console.log("mentor not found")
            return res.status(404).json({ message: "Mentor not found" });
        }
        res.status(200).json(mentor);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { updateMentor, getAllMentors, getSingleMentor, getApprovedMentors };