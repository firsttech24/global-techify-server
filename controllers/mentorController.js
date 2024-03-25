import mentorModel from "../models/mentorSchema";

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

        const updatedMentor = await mentor.save();

        res.status(200).json(updatedMentor);
    } catch (error) {
        res.status(500).json({ message: "Failed to update mentor", error: error.message });
    }
};