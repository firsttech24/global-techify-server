import express from "express";
import { getAllMentors, getApprovedMentors, getSingleMentor, updateMentor } from "../controllers/mentorController.js";

const router = express.Router();

router.get("/get/all", getAllMentors);
router.get("/get/approved", getApprovedMentors);
router.get("/get/:id", getSingleMentor);
router.post("/update/:id", updateMentor);

export default router;