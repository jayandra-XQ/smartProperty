import express from 'express';
import { getStats, getAllUsers } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.get('/stats', verifyAdmin, getStats);
router.get('/users', verifyAdmin, getAllUsers);

export default router;