import userModel from "../models/userSchema.js";
import mentorModel from "../models/mentorSchema.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const setUser = async (req, res) => {
    try {
        const { name, email, wnumber, password } = req.body;
        if (!(email && password)) {
            res.status(400).json({ message: "Both fields are compulsory..." })
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            res.status(401).json({ message: "user already exists with this email" });
        }

        const myEncPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name, email, wnumber, password: myEncPassword
        })

        const token = jwt.sign({ id: user._id, email }, process.env.jwtsecret, { expiresIn: "2h" });

        user.token = token;
        user.password = undefined;

        res.status(201).json(user)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.jwtsecret,
            { expiresIn: "2h" }
        );
        user.token = token;
        user.password = undefined;
        return res.status(200).json({ user, message: "User authenticated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const setMentor = async (req, res) => {
    try {
        const { email, password, name, wnumber } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Both email and password are required." });
        }

        const existingUser = await mentorModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await mentorModel.create({ email, password: hashedPassword, name, wnumber });

        const token = jwt.sign({ id: user._id, email }, process.env.jwtsecret, { expiresIn: "2h" });

        const response = {
            user: {
                _id: user._id,
                email: user.email,
                token: token
            },
            message: "Mentor created successfully."
        };

        user.password = undefined;
        res.status(201).json(response);
    } catch (error) {
        console.error("Error in setMentor:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getMentor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await mentorModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Mentor not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.jwtsecret,
            { expiresIn: "2h" }
        );

        user.token = token;
        user.password = undefined;

        res.status(200).json({ user, message: "Data sent successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export { getUser, setUser , getMentor, setMentor};