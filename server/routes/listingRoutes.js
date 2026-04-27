const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
} = require('../controllers/listingController');

// @route   GET /api/listings
// @route   POST /api/listings
router.route('/')
  .get(getListings)
  .post(createListing);

// @route   GET /api/listings/:id
// @route   PUT /api/listings/:id
// @route   DELETE /api/listings/:id
router.route('/:id')
  .get(getListingById)
  .put(updateListing)
  .delete(deleteListing);

module.exports = router;
