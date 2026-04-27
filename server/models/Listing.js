const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Books', 'Plastic', 'Paper', 'Misc']
  },
  image: {
    type: String, // URL or base64 string
    default: ''
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type (Donate/Request) is required'],
    enum: ['donate', 'request']
  },
  userName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'pickedup']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for id to match frontend expectation if needed
listingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtuals are serialized
listingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Listing', listingSchema);
