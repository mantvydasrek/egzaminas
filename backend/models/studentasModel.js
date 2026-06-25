const db = require('../db/database');

function gautiVisus(filtrai = {}) {
  let sql = 'SELECT * FROM studentai WHERE 1=1';
  const params = [];

  if (filtrai.course) {
    sql += ' AND kursas = ?';
    params.push(filtrai.course);
  }
  if (filtrai.id) {
    sql += ' AND id = ?';
    params.push(filtrai.id);
  }
  if (filtrai.vardas) {
    sql += ' AND LOWER(vardas) LIKE ?';
    params.push('%' + filtrai.vardas.toLowerCase() + '%');
  }
  if (filtrai.pavarde) {
    sql += ' AND LOWER(pavarde) LIKE ?';
    params.push('%' + filtrai.pavarde.toLowerCase() + '%');
  }

  sql += ' ORDER BY id DESC';
  return db.prepare(sql).all(...params);
}

function gautiPagalId(id) {
  return db.prepare('SELECT * FROM studentai WHERE id = ?').get(id);
}

function sukurti(vardas, pavarde, kursas) {
  const rezultatas = db.prepare(
    'INSERT INTO studentai (vardas, pavarde, kursas) VALUES (?, ?, ?)'
  ).run(vardas, pavarde, kursas);
  return gautiPagalId(rezultatas.lastInsertRowid);
}

function atnaujinti(id, vardas, pavarde, kursas) {
  const esamas = gautiPagalId(id);
  if (!esamas) return null;

  db.prepare(
    'UPDATE studentai SET vardas = ?, pavarde = ?, kursas = ? WHERE id = ?'
  ).run(vardas, pavarde, kursas, id);

  return gautiPagalId(id);
}

function istrinti(id) {
  const esamas = gautiPagalId(id);
  if (!esamas) return false;
  db.prepare('DELETE FROM studentai WHERE id = ?').run(id);
  return true;
}

module.exports = {
  gautiVisus,
  gautiPagalId,
  sukurti,
  atnaujinti,
  istrinti
};
