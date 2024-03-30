import express from "express"
import  {updateUser, getSingleUser } from "../controllers/userController.js";

const router = express.Router();

router.post('/update/:id', updateUser);
router.get("/get/:id", getSingleUser);


export default router;