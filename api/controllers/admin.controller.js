import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';


export const getStats = async (req, res, next) => {
  try {
    const totalListings = await Listing.countDocuments();
    const rentListings = await Listing.countDocuments({ type: 'rent' });
    const saleListings = await Listing.countDocuments({ type: 'sale' });
    const offerListings = await Listing.countDocuments({ offer: true });
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });

    res.status(200).json({
      totalListings,
      rentListings,
      saleListings,
      offerListings,
      totalUsers,
      adminUsers,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};