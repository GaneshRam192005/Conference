export const userModel = (db) => {
  const createQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'reviewer', 'admin') DEFAULT 'user',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createQuery, (err) => {
    if (err) {
      console.error("User table creation error:", err);
    }
  });
};
