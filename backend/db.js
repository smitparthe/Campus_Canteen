const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Samruddhi@172003",
  database: "campus_canteen"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }

  console.log("MySQL connected successfully!");
});

module.exports = db;