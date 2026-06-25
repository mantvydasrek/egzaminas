const Dalykas = require('../models/dalykasModel');
const Studentas = require('../models/studentasModel');

function validuotiDalyka(duomenys) {
  const klaidos = [];

  if (!duomenys.pavadinimas || typeof duomenys.pavadinimas !== 'string' || duomenys.pavadinimas.trim() === '') {
    klaidos.push('Dalyko pavadinimas yra privalomas');
  }
  if (duomenys.kreditai === undefined || duomenys.kreditai === null || duomenys.kreditai === '') {
    klaidos.push('Kreditu skaicius yra privalomas');
  } else {
    const k = Number(duomenys.kreditai);
    if (!Number.isInteger(k) || k < 1 || k > 30) {
      klaidos.push('Kreditu skaicius turi buti sveikas skaicius nuo 1 iki 30');
    }
  }

  return klaidos;
}

function gautiStudentoDalykus(req, res) {
  const studentoId = Number(req.params.studentoId);
  if (!Number.isInteger(studentoId) || studentoId < 1) {
    return res.status(400).json({ error: 'Neteisingas studento ID formatas' });
  }

  const studentas = Studentas.gautiPagalId(studentoId);
  if (!studentas) {
    return res.status(404).json({ error: 'Studentas nerastas' });
  }

  const dalykai = Dalykas.gautiPagalStudenta(studentoId);
  res.status(200).json(dalykai);
}

function pridetiDalyka(req, res) {
  const studentoId = Number(req.params.studentoId);
  if (!Number.isInteger(studentoId) || studentoId < 1) {
    return res.status(400).json({ error: 'Neteisingas studento ID formatas' });
  }

  const studentas = Studentas.gautiPagalId(studentoId);
  if (!studentas) {
    return res.status(404).json({ error: 'Studentas nerastas' });
  }

  const klaidos = validuotiDalyka(req.body);
  if (klaidos.length > 0) {
    return res.status(400).json({ error: 'Validacijos klaida', klaidos });
  }

  const naujas = Dalykas.sukurti(
    studentoId,
    req.body.pavadinimas.trim(),
    Number(req.body.kreditai)
  );

  res.status(201).json(naujas);
}

function atnaujintiDalyka(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Neteisingas ID formatas' });
  }

  const klaidos = validuotiDalyka(req.body);
  if (klaidos.length > 0) {
    return res.status(400).json({ error: 'Validacijos klaida', klaidos });
  }

  const atnaujintas = Dalykas.atnaujinti(
    id,
    req.body.pavadinimas.trim(),
    Number(req.body.kreditai)
  );

  if (!atnaujintas) {
    return res.status(404).json({ error: 'Dalykas nerastas' });
  }

  res.status(200).json(atnaujintas);
}

function istrintiDalyka(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Neteisingas ID formatas' });
  }

  const pavyko = Dalykas.istrinti(id);
  if (!pavyko) {
    return res.status(404).json({ error: 'Dalykas nerastas' });
  }

  res.status(204).send();
}

module.exports = {
  gautiStudentoDalykus,
  pridetiDalyka,
  atnaujintiDalyka,
  istrintiDalyka
};
