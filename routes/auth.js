import express from "express"
import { getMentor, getUser, setMentor, setUser } from "../controllers/authController.js";

const router = express.Router();
router.post("/user/get", getUser);
router.post("/user/set", setUser);
router.post("/mentor/get", getMentor);
router.post("/mentor/set", setMentor);

export default router;