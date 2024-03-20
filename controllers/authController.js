import userModel from "../models/userSchema.js";
import mentorModel from "../models/mentorSchema.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const setUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!(userName && password)) {
            res.status(400).json({ message: "Both fields are compulsory..." })
        }
        const existingUser = await userModel.findOne({ userName });
        if (existingUser) {
            res.status(401).json({ message: "user already exists with this userName" });
        }

        const myEncPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            userName, password: myEncPassword
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

const getUser = async () => {
    try {
        const { userName, password } = req.body;

        if (!(userName && password)) {
            res.status(400).json({ message: "send the data" });
        }

        const user = await userModel.findOne({ userName });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { userName: user.userName },
                process.env.jwtsecret,
                { expriresIn: "2h" }
            );
            user.token = token;
            user.password = undefined
            res.status(200).json({ user, message: "send the data" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const setMentor = async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!(userName && password)) {
            res.status(400).json({ message: "Both fields are compulsory..." })
        }
        const existingUser = await userModel.findOne({ userName });
        if (existingUser) {
            res.status(401).json({ message: "user already exists with this userName" });
        }

        const myEncPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            userName, password: myEncPassword
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

const getMentor = async () => {
    try {
        const { userName, password } = req.body;

        if (!(userName && password)) {
            res.status(400).json({ message: "send the data" });
        }

        const user = await userModel.findOne({ userName });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { userName: user.userName },
                process.env.jwtsecret,
                { expriresIn: "2h" }
            );
            user.token = token;
            user.password = undefined
            res.status(200).json({ user, message: "send the data" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export { getUser, setUser };