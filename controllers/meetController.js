import meetModel from "../models/meetSchema.js";

const initiateMeet = async (req, res) => {
    const { topic, type, student, mentor, date, startTime, endTime, duration } = req.body;
    try {
        const newMeet = await meetModel.create({
            topic, type, student, date, mentor, startTime, endTime, duration, approval: false, payment: false, paymentApproval: false, paymentId: ""
        })
        res.status(200).json(newMeet);
    } catch (error) {
        console.log(error);
    }
}

const allMentorMeets = async (req, res) => {
    const mentorId = req.params.id;
    try {
        const meets = await meetModel.find({ mentor: mentorId });
        res.status(200).json(meets);
    } catch (error) {
        console.log(error);
    }
}

const allStudentMeets = async (req, res) => {
    const studentId = req.params.id;
    try {
        const meets = await meetModel.find({ student: studentId });
        res.status(200).json(meets);
    } catch (error) {
        console.log(error);
    }
}

const meetApproval = async (req, res) => {
    const meetId = req.params.id;
    try {
        const meet = await meetModel.findById(meetId);
        meet.approval = true;
        await meet.save();
        res.status(200).json({ message: "meet successfully approved" });
    } catch (error) {
        console.log(error);
    }
}

const meetPayment = async (req, res) => {
    const meetId = req.params.meetId;
    const paymentId = req.params.paymentId;
    try {
        const meet = await meetModel.findById(meetId);
        meet.payment = true;
        meet.paymentId = paymentId;
        await meet.save();
        res.status(200).json({ message: "payment successfully updated" });
    } catch (error) {
        console.log(error);
    }
}


const paymentApproval = async (req, res) => {
    const meetId = req.params.id;
    try {
        const meet = await meetModel.findById(meetId);
        meet.paymentApproval = true;
        await meet.save();
        res.status(200).json({ message: "payment successfully approved" });
    } catch (error) {
        console.log(error);
    }
}


export { initiateMeet, meetApproval, meetPayment, paymentApproval, allMentorMeets, allStudentMeets };