import express from "express"
import { getPortalData, sendContactMail, setPortalData } from "../controllers/portalController.js";

const router = express.Router();

router.get('/get', getPortalData);
router.post('/set/:id', setPortalData);
router.post('/mail', sendContactMail);

export default router;