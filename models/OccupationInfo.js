const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OccupationInfoSchema = new Schema({
  occupation_status: {
    type: String,
    required: true,
    enum: ['business', 'salaried'],
  },
  shopname: {
    type: String,
    required: function() {
      return this.occupation_status === 'business';
    }
  },
  shopaddress: {
    type: String,
    required: function() {
      return this.occupation_status === 'business';
    }
  },
  shoppincode: {
    type: String,
    required: function() {
      return this.occupation_status === 'business';
    },
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid 6-digit shoppincode!`
    }
  },
  officename: {
    type: String,
    required: function() {
      return this.occupation_status === 'salaried';
    }
  },
  officeaddress: {
    type: String,
    required: function() {
      return this.occupation_status === 'salaried';
    }
  },
  officepincode: {
    type: String,
    required: function() {
      return this.occupation_status === 'salaried';
    },
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid 6-digit office pincode!`
    }
  },
  proof_of_validation: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const OccupationInfo = mongoose.model('OccupationInfo', OccupationInfoSchema);

module.exports = OccupationInfo;
