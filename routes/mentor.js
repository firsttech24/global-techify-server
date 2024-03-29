import express from "express";
import { getAllMentors, getSingleMentor, updateMentor } from "../controllers/mentorController.js";

const router = express.Router();

router.get("/get/all", getAllMentors);
router.get("/get/:id", getSingleMentor);
router.post("/update/:id", updateMentor);

export default router;