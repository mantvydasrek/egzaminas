const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'registras.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS studentai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vardas TEXT NOT NULL,
    pavarde TEXT NOT NULL,
    kursas INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dalykai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studento_id INTEGER NOT NULL,
    pavadinimas TEXT NOT NULL,
    kreditai INTEGER NOT NULL,
    FOREIGN KEY (studento_id) REFERENCES studentai(id) ON DELETE CASCADE
  );
`);

module.exports = db;
