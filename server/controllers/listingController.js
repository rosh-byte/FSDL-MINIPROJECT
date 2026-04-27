const Listing = require('../models/Listing');

// @desc    Get all listings
// @route   GET /api/listings
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
exports.createListing = async (req, res) => {
  const listing = new Listing({
    itemName: req.body.itemName,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    whatsappNumber: req.body.whatsappNumber,
    userName: req.body.userName,
    type: req.body.type,
    status: req.body.status || 'available'
  });

  try {
    const newListing = await listing.save();
    console.log('✅ Created listing:', newListing._id);
    res.status(201).json(newListing);
  } catch (error) {
    console.error('❌ Create error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
exports.updateListing = async (req, res) => {
  try {
    console.log('Updating listing:', req.params.id, req.body);
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Update fields
    if (req.body.itemName) listing.itemName = req.body.itemName;
    if (req.body.description) listing.description = req.body.description;
    if (req.body.category) listing.category = req.body.category;
    if (req.body.image !== undefined) listing.image = req.body.image;
    if (req.body.location) listing.location = req.body.location;
    if (req.body.whatsappNumber) listing.whatsappNumber = req.body.whatsappNumber;
    if (req.body.userName) listing.userName = req.body.userName;
    if (req.body.type) listing.type = req.body.type;
    if (req.body.status) listing.status = req.body.status;

    const updatedListing = await listing.save();
    console.log('✅ Updated listing:', updatedListing._id);
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error('❌ Update error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    console.log('Deleting listing:', req.params.id);
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    await Listing.findByIdAndDelete(req.params.id);
    console.log('✅ Deleted listing:', req.params.id);
    res.status(200).json({ message: 'Listing deleted' });
  } catch (error) {
    console.error('❌ Delete error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
