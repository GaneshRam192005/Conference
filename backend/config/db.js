const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change as needed
  password: "Ismail@2006",       // change as needed
  database: "conference_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

module.exports = db;
