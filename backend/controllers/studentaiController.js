const Studentas = require('../models/studentasModel');
const Dalykas = require('../models/dalykasModel');

function validuotiStudenta(duomenys) {
  const klaidos = [];

  if (!duomenys.vardas || typeof duomenys.vardas !== 'string' || duomenys.vardas.trim() === '') {
    klaidos.push('Vardas yra privalomas');
  }
  if (!duomenys.pavarde || typeof duomenys.pavarde !== 'string' || duomenys.pavarde.trim() === '') {
    klaidos.push('Pavarde yra privaloma');
  }
  if (duomenys.kursas === undefined || duomenys.kursas === null || duomenys.kursas === '') {
    klaidos.push('Kursas yra privalomas');
  } else {
    const k = Number(duomenys.kursas);
    if (!Number.isInteger(k) || k < 1 || k > 6) {
      klaidos.push('Kursas turi buti skaicius nuo 1 iki 6');
    }
  }

  return klaidos;
}

function gautiVisus(req, res) {
  const filtrai = {};
  if (req.query.course) filtrai.course = Number(req.query.course);
  if (req.query.id) filtrai.id = Number(req.query.id);
  if (req.query.vardas) filtrai.vardas = req.query.vardas;
  if (req.query.pavarde) filtrai.pavarde = req.query.pavarde;

  const studentai = Studentas.gautiVisus(filtrai);
  const suDalykais = studentai.map(s => ({
    ...s,
    dalykai: Dalykas.gautiPagalStudenta(s.id)
  }));

  res.status(200).json(suDalykais);
}

function gautiPagalId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Neteisingas ID formatas' });
  }

  const studentas = Studentas.gautiPagalId(id);
  if (!studentas) {
    return res.status(404).json({ error: 'Studentas nerastas' });
  }

  studentas.dalykai = Dalykas.gautiPagalStudenta(id);
  res.status(200).json(studentas);
}

function sukurti(req, res) {
  const klaidos = validuotiStudenta(req.body);
  if (klaidos.length > 0) {
    return res.status(400).json({ error: 'Validacijos klaida', klaidos });
  }

  const naujas = Studentas.sukurti(
    req.body.vardas.trim(),
    req.body.pavarde.trim(),
    Number(req.body.kursas)
  );
  naujas.dalykai = [];
  res.status(201).json(naujas);
}

function atnaujinti(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Neteisingas ID formatas' });
  }

  const klaidos = validuotiStudenta(req.body);
  if (klaidos.length > 0) {
    return res.status(400).json({ error: 'Validacijos klaida', klaidos });
  }

  const atnaujintas = Studentas.atnaujinti(
    id,
    req.body.vardas.trim(),
    req.body.pavarde.trim(),
    Number(req.body.kursas)
  );

  if (!atnaujintas) {
    return res.status(404).json({ error: 'Studentas nerastas' });
  }

  atnaujintas.dalykai = Dalykas.gautiPagalStudenta(id);
  res.status(200).json(atnaujintas);
}

function istrinti(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Neteisingas ID formatas' });
  }

  const pavyko = Studentas.istrinti(id);
  if (!pavyko) {
    return res.status(404).json({ error: 'Studentas nerastas' });
  }

  res.status(204).send();
}

module.exports = {
  gautiVisus,
  gautiPagalId,
  sukurti,
  atnaujinti,
  istrinti
};
