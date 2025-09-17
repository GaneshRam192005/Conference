import { db } from "../config/db.js";

export const saveRegistration = (formData, callback) => {
  const { userId, paperTitle, authors, abstract } = formData;
  const email = authors.length > 0 ? authors[0].email : '';

  console.log("Abstract buffer size:", abstract ? abstract.length : 0);

  const sql = `INSERT INTO registrations (userId, paperTitle, authors, abstractBlob, email)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [userId, paperTitle, JSON.stringify(authors), abstract, email], (err, result) => {
    if (err) {
      callback(err);
    } else {
      // Return the inserted ID in the result
      callback(null, result);
    }
  });
};
