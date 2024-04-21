import meetModel from "../models/meetSchema.js";
import stripePackage from 'stripe';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';


// Function to send email
const sendEmail = async () => {
    // Creating a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'shivbhu2112564@gmail.com',
            pass: 'xeoilgshhouzjevl'
        }
    });

    // Email content
    const mailOptions = {
        from: 'shivbhu2112564@gmail.com',
        to: 'gogoipranjal2019@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email sent from Node.js'
    };

    try {
        // Sending email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error occurred:', error);
    }
};



// const stripe = stripePackage('sk_test_51P4Fc1SCy0FHAbvF86eMm5ioyoMxtnidlOw5PxomKthVS9oaT9YP7q0trkSFnasoIvWFOO8mzXpA4VXtg7x5LFS300YXLm24yX');
// const paymentProcess = async (req, res) => {
//     try {
//         const product = await stripe.products.create({
//             name: 'Global Techify',
//             description: 'payment for mentorship',
//         });

//         const price = await stripe.prices.create({
//             unit_amount: 1200,
//             currency: 'usd',
//             product: product.id,
//         });

//         console.log('Success! Here is your product id: ' + product.id);
//         console.log('Success! Here is your price id: ' + price.id);

//         // Create a Checkout Session
//         const data = {
//             payment_method_types: ['card'],
//             line_items: [{
//                 price: price.id,
//                 quantity: 1,
//             }],
//             mode: 'payment',
//             success_url: 'http://yourwebsite.com/success',
//             cancel_url: 'http://yourwebsite.com/cancel',
//         };


//         const session = await stripe.checkout.sessions.create(data);

//         // Return the session ID to the client
//         res.status(202).json({ sessionId: session.id });
//     } catch (error) {
//         console.error('Error:', error);
//         // Handle specific Stripe errors
//         if (error.type === 'StripeCardError') {
//             // The card has been declined
//             return res.status(400).json({ error: 'Your card was declined.' });
//         } else {
//             // Other types of errors
//             return res.status(500).json({ error: 'An error occurred while processing your payment.' });
//         }
//     }
// };


const paymentProcess = async (req, res) => {
    try {
        var instance = new Razorpay({ key_id: 'rzp_test_BbdZCd9xvyEEFa', key_secret: '3DqEUNThCwrhRa0Y2CWehP5C' })

        instance.orders.create({
            amount: 50000,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                key1: "value3",
                key2: "value2"
            }
        })

        res.status(200).json(instance);
    } catch (error) {
        console.log(error)
    }
}


const initiateMeet = async (req, res) => {
    const { topic, type, student, mentor, date, startTime, endTime, duration } = req.body;
    try {
        const newMeet = await meetModel.create({
            topic, type, student, date, mentor, startTime, endTime, duration, approval: false, payment: false, paymentApproval: false, paymentId: "", link: ""
        })
        res.status(200).json(newMeet);
    } catch (error) {
        console.log(error);
    }
}

const allMentorMeets = async (req, res) => {
    const mentorId = req.params.id;
    try {
        const meets = await meetModel.find({ mentor: mentorId }).populate('student');
        res.status(200).json(meets);
    } catch (error) {
        console.log(error);
    }
}

const allStudentMeets = async (req, res) => {
    const studentId = req.params.id;
    try {
        const meets = await meetModel.find({ student: studentId }).populate('mentor student');
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
        sendEmail();
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

const updateLink = async (req, res) => {
    const meetId = req.params.id;
    const link = req.body.meetingUrl;
    try {
        const meet = await meetModel.findById(meetId);
        meet.link = link;
        await meet.save();
        res.status(200).json({message : "meet link updated"});
    } catch (error) {
        console.log(error);
    }
}



export { initiateMeet, meetApproval, meetPayment, paymentApproval, allMentorMeets, allStudentMeets, paymentProcess, updateLink };