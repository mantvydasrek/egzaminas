const db = require('../db/database');

function gautiPagalStudenta(studentoId) {
  return db.prepare(
    'SELECT * FROM dalykai WHERE studento_id = ? ORDER BY id'
  ).all(studentoId);
}

function gautiPagalId(id) {
  return db.prepare('SELECT * FROM dalykai WHERE id = ?').get(id);
}

function sukurti(studentoId, pavadinimas, kreditai) {
  const rezultatas = db.prepare(
    'INSERT INTO dalykai (studento_id, pavadinimas, kreditai) VALUES (?, ?, ?)'
  ).run(studentoId, pavadinimas, kreditai);
  return gautiPagalId(rezultatas.lastInsertRowid);
}

function atnaujinti(id, pavadinimas, kreditai) {
  const esamas = gautiPagalId(id);
  if (!esamas) return null;

  db.prepare(
    'UPDATE dalykai SET pavadinimas = ?, kreditai = ? WHERE id = ?'
  ).run(pavadinimas, kreditai, id);

  return gautiPagalId(id);
}

function istrinti(id) {
  const esamas = gautiPagalId(id);
  if (!esamas) return false;
  db.prepare('DELETE FROM dalykai WHERE id = ?').run(id);
  return true;
}

module.exports = {
  gautiPagalStudenta,
  gautiPagalId,
  sukurti,
  atnaujinti,
  istrinti
};
