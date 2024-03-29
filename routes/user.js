import express from "express"
import updateUser from "../controllers/userController.js";

const router = express.Router();

router.post('/update/:id', updateUser);


export default router;