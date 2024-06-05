const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pincodeValidator = {
  
  validator: function(v) {
    return /^\d{6}$/.test(v); // Regular expression to match exactly 6 digits
  },
  message: props => `${props.value} is not a valid 6-digit pincode!`
};

const AddressSchema = new Schema({
  resident_info: {
    type: String,
    required: true,
  },
  resident_pincode: {
    type: String,
    required: true,
    validate: pincodeValidator
  },
  permanent_address: {
    type: String,
    required: true,
  },
  permanent_pincode: {
    type: String,
    required: true,
    validate: pincodeValidator
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
    unique: true,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
