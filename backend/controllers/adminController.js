import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'necadmin';

export const createReviewer = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if user already exists
    const checkUserQuery = 'SELECT id FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert reviewer
      const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [name, email, hashedPassword, 'reviewer'], (err, result) => {
        if (err) {
          console.error('DB insert error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({
          message: 'Reviewer created successfully',
          user: { id: result.insertId, name, email, role: 'reviewer' }
        });
      });
    });
  } catch (error) {
    console.error('Create reviewer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReviewers = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  const query = "SELECT id, name, email FROM users WHERE role = 'reviewer'";

  db.query(query, (err, results) => {
    if (err) {
      console.error('DB error fetching reviewers:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
};

export const assignReviewer = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  const { paperId, reviewerId } = req.body;

  if (!paperId || !reviewerId) {
    return res.status(400).json({ error: 'paperId and reviewerId are required' });
  }

  // Check if assignment already exists
  const checkQuery = 'SELECT * FROM paper_assignments WHERE paperId = ?';
  db.query(checkQuery, [paperId], (err, results) => {
    if (err) {
      console.error('DB error checking assignment:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      // Update existing assignment
      const updateQuery = 'UPDATE paper_assignments SET reviewerId = ?, assignedAt = CURRENT_TIMESTAMP WHERE paperId = ?';
      db.query(updateQuery, [reviewerId, paperId], (updateErr) => {
        if (updateErr) {
          console.error('DB error updating assignment:', updateErr);
          return res.status(500).json({ error: 'Database error' });
        }
        return res.json({ message: 'Reviewer assignment updated successfully' });
      });
    } else {
      // Insert new assignment
      const insertQuery = 'INSERT INTO paper_assignments (paperId, reviewerId) VALUES (?, ?)';
      db.query(insertQuery, [paperId, reviewerId], (insertErr) => {
        if (insertErr) {
          console.error('DB error inserting assignment:', insertErr);
          return res.status(500).json({ error: 'Database error' });
        }
        return res.status(201).json({ message: 'Reviewer assigned successfully' });
      });
    }
  });
};

export const getReviewersWithAssignments = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  const query = `
    SELECT
      u.id,
      u.name,
      u.email,
      COUNT(pa.paperId) as assignedPapers,
      GROUP_CONCAT(r.paperTitle SEPARATOR '; ') as paperTitles
    FROM users u
    LEFT JOIN paper_assignments pa ON u.id = pa.reviewerId
    LEFT JOIN registrations r ON pa.paperId = r.id
    WHERE u.role = 'reviewer'
    GROUP BY u.id, u.name, u.email
    ORDER BY u.name
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('DB error fetching reviewers with assignments:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Process the results to format paper titles
    const processedResults = results.map(reviewer => ({
      id: reviewer.id,
      name: reviewer.name,
      email: reviewer.email,
      assignedPapers: reviewer.assignedPapers,
      paperTitles: reviewer.paperTitles ? reviewer.paperTitles.split('; ') : []
    }));

    res.json(processedResults);
  });
};

export const seedAdmin = async () => {
  const adminEmail = 'admin@nec.com';
  const adminPassword = 'admin123';
  const adminName = 'NEC Admin';

  try {
    // Check if admin already exists
    const checkQuery = 'SELECT id FROM users WHERE email = ?';
    db.query(checkQuery, [adminEmail], async (err, results) => {
      if (err) {
        console.error('DB error checking admin:', err);
        return;
      }

      if (results.length > 0) {
        console.log('Admin user already exists');
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Insert admin
      const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [adminName, adminEmail, hashedPassword, 'admin'], (err, result) => {
        if (err) {
          console.error('DB insert admin error:', err);
        } else {
          console.log('Default admin user created: admin@nec.com / admin123');
        }
      });
    });
  } catch (error) {
    console.error('Seed admin error:', error);
  }
};
