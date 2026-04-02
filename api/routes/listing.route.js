import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { createListing, deleteListing, getListing, updateListing, getListings } from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', verifyAdmin, createListing)
router.delete('/delete/:id', verifyAdmin, deleteListing);
router.get('/get', getListings);
router.put('/update/:id', verifyAdmin, updateListing, getListing);
router.get('/get/:id', getListing);


export default router