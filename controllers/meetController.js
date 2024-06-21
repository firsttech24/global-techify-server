import meetModel from "../models/meetSchema.js";
import userModel from "../models/userSchema.js";
import mentorModel from "../models/mentorSchema.js";
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';

const sendEmail = async (subject, studentEmail, html) => {
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
        to: studentEmail,
        subject: subject,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response, studentEmail);
    } catch (error) {
        console.error('Error occurred:', error, studentEmail);
        throw new Error('Failed to send email');
    }
};

const checkTimeConflict = async (proposedDate, proposedStartTime, proposedEndTime) => {
    try {
        const conflicts = await meetModel.find({
            $or: [
                { $and: [{ date: proposedDate }, { $and: [{ startTime: { $lte: proposedStartTime } }, { endTime: { $gte: proposedStartTime } }, {payment : true}] }] },
                { $and: [{ date: proposedDate }, { $and: [{ startTime: { $lte: proposedEndTime } }, { endTime: { $gte: proposedEndTime } }, { payment: true }] }] },
                { $and: [{ date: proposedDate }, { $and: [{ startTime: { $gte: proposedStartTime } }, { endTime: { $lte: proposedEndTime } }, { payment: true }] }] }
            ]
        });

        return conflicts.length > 0;
    } catch (error) {
        console.log(error);
        return true;
    }
};

const paymentProcess = async (req, res) => {
    const {amount} = req.body;
    try {
        var instance = new Razorpay({ key_id: 'rzp_test_BbdZCd9xvyEEFa', key_secret: '3DqEUNThCwrhRa0Y2CWehP5C' })

        const order = await instance.orders.create({
            amount: amount*100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                key1: "value3",
                key2: "value2"
            }
        });

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while processing payment" });
    }
};

const paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {

        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        res.redirect(
            `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
        );
    } else {
        res.status(400).json({
            success: false,
        });
    }
};


const initiateMeet = async (req, res) => {
    const { topic, type, student, mentor, date, price, startTime, endTime, duration } = req.body;
    try {
        const studentDoc = await userModel.findById(student);
        const mentorDoc = await mentorModel.findById(mentor);

        if (!studentDoc) return res.status(404).json({ message: "Student not found" });
        if (!mentorDoc) return res.status(404).json({ message: "Mentor not found" });

        const conflictExists = await checkTimeConflict(date, startTime, endTime);
        if (conflictExists) {
            return res.status(404).json({ message: "Conflict exists, cannot schedule meet at this time." });
        }

        const newMeet = await meetModel.create({
            topic, type, student, date, mentor, startTime, price, endTime, duration, approval: false, payment: false, paymentApproval: false, paymentId: "", link: ""
        });

        const studentEmail = studentDoc?.email;
        const studentSubject = 'New Mentorship Request';
        const studentHtml = `
            <p>Dear ${studentDoc?.name},</p>
            <p>You have initiated a ${type} meet with ${mentorDoc?.name} on ${date}.</p>
            <p>Please wait for mentor approval.</p>
            <p>Best Regards,</p>
            <p>Team Global Techify</p>
        `;
        await sendEmail(studentSubject, studentEmail, studentHtml);

        const mentorEmail = mentorDoc.email;
        const mentorSubject = 'New Mentorship Request';
        const mentorHtml = `
            <p>Dear ${mentorDoc.name},</p>
            <p>${studentDoc.name} has initiated a ${type} meet with you on ${date}.</p>
            <p>Please review and approve the request.</p>
            <p>Best Regards,</p>
            <p>Team Global Techify</p>
        `;
        await sendEmail(mentorSubject, mentorEmail, mentorHtml);

        res.status(200).json(newMeet);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while initiating meet" });
    }
};



const allMentorMeets = async (req, res) => {
    const mentorId = req.params.id;
    try {
        const meets = await meetModel.find({ mentor: mentorId }).populate('student');
        res.status(200).json(meets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while fetching mentor meets" });
    }
};

const allStudentMeets = async (req, res) => {
    const studentId = req.params.id;
    try {
        const meets = await meetModel.find({ student: studentId }).populate('mentor student');
        res.status(200).json(meets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while fetching student meets" });
    }
};

const meetApproval = async (req, res) => {
    const meetId = req.params.id;
    try {
        const meet = await meetModel.findById(meetId).populate('student mentor');
        if (!meet) {
            return res.status(404).json({ message: "Meet not found" });
        }
        meet.approval = true;
        await meet.save();

        const studentEmail = meet.student?.email || "shivbhu2112564@gmail.com";
        const subject = 'Confirmation of Mentorship Request Acceptance';
        const html = `
            <p>Dear ${meet.student?.name},</p>
            <p>${meet.mentor?.name} has accepted your request for a ${meet.type} in ${meet.topic} profile scheduled at ${meet.time} on ${meet.date}. Please log in to globaltechify.com using ${studentEmail} and go to your Accepted Requests section, and then pay INR ${meet.price} ONLY to confirm this Mentorship/Mock Interview as soon as possible.</p>
            <p>Best Wishes and Regards</p>
            <p>Team Global Techify</p>
        `;

        await sendEmail(subject, studentEmail, html);

        res.status(200).json({ message: "Meet successfully approved and email sent" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while approving meet" });
    }
};

const meetPayment = async (req, res) => {
    const meetId = req.params.meetId;
    const paymentId = req.params.paymentId;
    try {
        const meet = await meetModel.findById(meetId).populate('student mentor');
        if (!meet) {
            return res.status(404).json({ message: "Meet not found" });
        }
        meet.payment = true;
        meet.paymentId = paymentId;
        await meet.save();

        const studentEmail = meet.student.email;
        const studentSubject = 'Payment Confirmation';
        const studentHtml = `
            <p>Dear ${meet.student.name},</p>
            <p>Your payment for the ${meet.type} in ${meet.topic} profile scheduled at ${meet.time} on ${meet.date} has been successfully processed.</p>
            <p>Thank you for your payment!</p>
            <p>Best Wishes and Regards</p>
            <p>Team Global Techify</p>
        `;
        await sendEmail(studentSubject, studentEmail, studentHtml);

        const mentorEmail = meet.mentor.email;
        const mentorSubject = 'Payment Received';
        const mentorHtml = `
            <p>Dear ${meet.mentor.name},</p>
            <p>The payment for the ${meet.type} in ${meet.topic} profile scheduled with ${meet.student.name} on ${meet.time} on ${meet.date} has been successfully processed.</p>
            <p>Please provide the meet link to the student as soon as possible.</p>
            <p>Best Regards,</p>
            <p>Team Global Techify</p>
        `;
        await sendEmail(mentorSubject, mentorEmail, mentorHtml);

        res.status(200).json({ message: "Payment successfully updated and emails sent" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while updating payment status" });
    }
};

const paymentApproval = async (req, res) => {
    const meetId = req.params.id;
    try {
        const meet = await meetModel.findById(meetId);
        if (!meet) {
            return res.status(404).json({ message: "Meet not found" });
        }
        meet.paymentApproval = true;
        await meet.save();
        res.status(200).json({ message: "Payment successfully approved" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while approving payment" });
    }
};

const updateLink = async (req, res) => {
    const meetId = req.params.id;
    const link = req.body.meetingUrl;
    try {
        const meet = await meetModel.findById(meetId).populate('student');
        if (!meet) {
            return res.status(404).json({ message: "Meet not found" });
        }
        meet.link = link;
        await meet.save();

        const studentEmail = meet.student.email;
        const studentSubject = 'Meet Link Updated';
        const studentHtml = `
            <p>Dear ${meet.student.name},</p>
            <p>The meet link for the ${meet.type} in ${meet.topic} profile scheduled at ${meet.time} on ${meet.date} has been updated.</p>
            <p>Please use the following link to join the meet: ${link}</p>
            <p>Kindly ensure to join the meet at the scheduled time. We look forward to seeing you there!</p>
            <p>Best Regards,</p>
            <p>Team Global Techify</p>
        `;
        await sendEmail(studentSubject, studentEmail, studentHtml);

        res.status(200).json({ message: "Meet link updated and email sent to student" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while updating meet link and sending email" });
    }
};

const requestLink = async (req, res) => {
    const meetId = req.params.id;
    try {
        const meet = await meetModel.findById(meetId).populate("mentor student");
        if (!meet) {
            return res.status(404).json({ message: "Meet not found" });
        }

        const studentEmail = meet.mentor.email;
        const studentSubject = 'Request for Meet link';
        const studentHtml = `
            <p>Dear ${meet.mentor.name},</p>
            <p>The meet link for the ${meet.type} in ${meet.topic} profile scheduled at ${meet.time} on ${meet.date} needs to be updated.</p>
            <p>Please provide the link for the meet</p>
            <p>Best Regards,</p>
            <p>Team Global Techify</p>
        `;
        await sendEmail(studentSubject, studentEmail, studentHtml);

        res.status(200).json({ message: "Meet link updated and email sent to student" });

    } catch (error) {
        console.log(error);
    }
}

export {
    initiateMeet,
    meetApproval,
    meetPayment,
    paymentApproval,
    allMentorMeets,
    allStudentMeets,
    paymentProcess,
    updateLink,
    paymentVerification,
    requestLink
};
