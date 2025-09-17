export const registrationModel = (db) => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(50) NOT NULL,
      paperTitle VARCHAR(255) NOT NULL,
      authors JSON NOT NULL,
      abstractBlob LONGBLOB,
      email VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createQuery, (err) => {
    if (err) {
      console.error("Table creation error:", err);
    } else {
      // Add abstractBlob column if it doesn't exist
      const alterQuery = `
        ALTER TABLE registrations
        ADD COLUMN abstractBlob LONGBLOB
      `;
      db.query(alterQuery, (alterErr) => {
        if (alterErr && !alterErr.message.includes('Duplicate column name')) {
          console.error("Table alter error:", alterErr);
        }
      });
    }
  });

  // Create paper_assignments table
  const assignmentQuery = `
    CREATE TABLE IF NOT EXISTS paper_assignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      paperId INT NOT NULL,
      reviewerId INT NOT NULL,
      assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paperId) REFERENCES registrations(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_assignment (paperId, reviewerId)
    )
  `;
  db.query(assignmentQuery, (err) => {
    if (err) {
      console.error("Paper assignments table creation error:", err);
    }
  });
};
