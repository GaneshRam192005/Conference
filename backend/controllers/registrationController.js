const db = require('../config/db');
const { sendApplyConfirmationEmail } = require('../services/emailServices');

exports.registerUser = async (req, res) => {
  try {
    const {
  userId,
  name,
  designation,
  department,
  type,
  institution,
  email,
  mobile,
  paperTitle,
  teamSize
} = req.body;

 let teamMembers = [];
if (req.body.teamMembers) {
  try {
    teamMembers = JSON.parse(req.body.teamMembers);
  } catch (e) {
    return res.status(400).json({ error: "Invalid teamMembers format" });
  }
}

    const abstractFile = req.file ? req.file.path : null;
    console.log('Received registration:', req.body, req.file);

    if (!userId || !name || !designation || !department || !type || !institution || !email || !mobile || !paperTitle || !abstractFile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
const sql = `INSERT INTO registrations 
  (userId, name, designation, department, type, institution, email, mobile, paperTitle, abstractFile, teamSize, teamMembers)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      userId,
      name,
      designation,
      department,
      type,
      institution,
      email,
      mobile,
      paperTitle,
      coAuthors,
      abstractFile,
      teamSize,
      JSON.stringify(teamMembers)
    ], async (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Send confirmation email
      try {
        await sendApplyConfirmationEmail(email, name);
      } catch (emailErr) {
        console.error('Email error:', emailErr);
      }
      res.status(200).json({ message: 'Registration successful', id: result.insertId });
    });
  } catch (err) {
    console.error('Controller Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};