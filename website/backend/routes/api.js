const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

router.get('/records', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5000;
    const records = await Record.find().sort({ timestamp: -1 }).limit(limit);
    
    const totalRecords = await Record.countDocuments();
    const totalCrashes = await Record.countDocuments({ isCrash: true });
    
    res.json({
      stats: { totalRecords, totalCrashes },
      data: records
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
