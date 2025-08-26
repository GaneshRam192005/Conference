const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser } = require('../controllers/registrationController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('abstract'), registerUser);

module.exports = router;