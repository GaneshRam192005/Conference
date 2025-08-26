const db = require("../config/db");

const insertRegistration = (data, callback) => {
  const sql = `
    INSERT INTO registrations 
    (userId, name, designation, department, type, institution, email, mobile, paperTitle, coAuthors, abstractFile) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.userId,
    data.name,
    data.designation,
    data.department,
    data.type,
    data.institution,
    data.email,
    data.mobile,
    data.paperTitle,
    data.coAuthors,
    data.abstractFile,
  ];

  db.query(sql, values, callback);
};

module.exports = { insertRegistration };
