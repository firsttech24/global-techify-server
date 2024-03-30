import userModel from "../models/userSchema.js";

const updateUser = async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const {
            name,
            email,
            wnumber,
            resume,
            profilePhoto,
            profiles,
            education,
            socials,
        } = req.body;

        user.name = name;
        user.email = email;
        user.wnumber = wnumber;
        user.resume = resume;
        user.profilePhoto = profilePhoto;
        user.profiles = profiles;
        user.education = education;
        user.socials = socials;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    }
    catch (error){
        console.log(error);
    }
}

const getSingleUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            console.log("user not found")
            return res.status(404).json({ message: "user not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {updateUser, getSingleUser};