import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing, getListing, updateListing, getListings } from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/listings', getListings);
router.put('/update/:id', verifyToken, updateListing, getListing);
router.get('/get/:id', getListing);


export default router