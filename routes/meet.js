import express from 'express';
import { meetApproval, initiateMeet, meetPayment, paymentApproval, allMentorMeets, allStudentMeets, paymentProcess, updateLink } from '../controllers/meetController.js';

const router = express.Router();

router.post('/initiate', initiateMeet);
router.get('/approval/:id', meetApproval);
router.post('/updatelink/:id', updateLink)
router.get('/payment/done/:meetId/:paymentId', meetPayment);
router.get('/payment/approval/:id', paymentApproval);
router.get('/all/mentor/:id', allMentorMeets);
router.get('/all/student/:id', allStudentMeets);
router.get('/paymentgateway', paymentProcess);

export default router;