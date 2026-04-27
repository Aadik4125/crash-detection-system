const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  accelerationX: { type: Number, default: 0 },
  accelerationY: { type: Number, default: 0 },
  accelerationZ: { type: Number, default: 0 },
  speed: { type: Number, required: true },
  tiltAngle: { type: Number, required: true },
  vibration: { type: Number, required: true },
  isCrash: { type: Boolean, required: true, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Record', RecordSchema);
