import portalModel from "../models/portalSchema.js";
import nodemailer from "nodemailer";

const getPortalData = async (req, res) => {
    const data = req.body;
    try {
        const portalData = await portalModel.find();
        res.status(200).json(portalData);
    } catch (error) {
        console.log(error);
        res.status(400).json("internal server error");
    }
}

const setPortalData = async (req, res) => {
    const data = req.body;
    const portalID = req.params.id;
    console.log(data)
    try {
        await portalModel.findByIdAndUpdate(portalID, data);

        const updatedPortalData = await portalModel.findById(portalID);

        res.status(200).json(updatedPortalData);
    } catch (error) {
        console.log(error);
        res.status(400).json("internal server error");
    }
}

const sendContactMail = async(req, res) => {
    let {name, email, mobile, message} = req.body;
    if(!name) name = "";
    if(!mobile) mobile = "";
    if(!message) message = "";
    console.log(name)
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: 'global.techify.info@gmail.com',
            to: 'global.techify.info@gmail.com',
            subject: `contact required `,
            html: `
                name : ${name},
                email : ${email},
                mobile : ${mobile},
                message : ${message}
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            res.status(200).json({message : "email sent"})
        } catch (error) {
            console.error('Error occurred:', error);
            throw new Error('Failed to send email');
            res.status(400).json({ message: "email sent" })
        }
    } catch (error) {
        console.log(error);
    }
}


export { getPortalData, setPortalData,sendContactMail };