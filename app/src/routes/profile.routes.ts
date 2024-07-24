import express from 'express';
const router = express.Router();

import * as profileServices from '../controllers/profile.controller';

router.put("/", profileServices.editPassword);
router.post("/", profileServices.logout);

export default router;
