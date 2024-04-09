import express from "express"
import { getPortalData, setPortalData } from "../controllers/portalController.js";

const router = express.Router();

router.get('/get', getPortalData);
router.post('/set/:id', setPortalData);

export default router;