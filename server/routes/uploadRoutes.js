const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error('Upload Error:', error); // টার্মিনালে বিস্তারিত এরর দেখাবে
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;