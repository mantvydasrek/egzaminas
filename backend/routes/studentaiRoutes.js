const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

const testDbPath = path.join(__dirname, '..', 'db', 'registras.db');
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

const Studentas = require('../models/studentasModel');
const Dalykas = require('../models/dalykasModel');

test('Sukurti studenta', () => {
  const s = Studentas.sukurti('Jonas', 'Jonaitis', 2);
  assert.ok(s.id);
  assert.strictEqual(s.vardas, 'Jonas');
  assert.strictEqual(s.pavarde, 'Jonaitis');
  assert.strictEqual(s.kursas, 2);
});

test('Gauti studenta pagal ID', () => {
  const s = Studentas.sukurti('Petras', 'Petraitis', 3);
  const rastas = Studentas.gautiPagalId(s.id);
  assert.strictEqual(rastas.vardas, 'Petras');
});

test('Atnaujinti studenta', () => {
  const s = Studentas.sukurti('Ona', 'Onaityte', 1);
  const atnaujintas = Studentas.atnaujinti(s.id, 'Ona', 'Kazlauskiene', 2);
  assert.strictEqual(atnaujintas.pavarde, 'Kazlauskiene');
  assert.strictEqual(atnaujintas.kursas, 2);
});

test('Istrinti studenta', () => {
  const s = Studentas.sukurti('Antanas', 'Antanaitis', 4);
  const pavyko = Studentas.istrinti(s.id);
  assert.strictEqual(pavyko, true);
  assert.strictEqual(Studentas.gautiPagalId(s.id), undefined);
});

test('Filtruoti pagal kursa', () => {
  Studentas.sukurti('A', 'B', 5);
  Studentas.sukurti('C', 'D', 5);
  const rezultatas = Studentas.gautiVisus({ course: 5 });
  assert.ok(rezultatas.length >= 2);
  rezultatas.forEach(s => assert.strictEqual(s.kursas, 5));
});

test('Prideti dalyka studentui', () => {
  const s = Studentas.sukurti('Testas', 'Testaitis', 1);
  const d = Dalykas.sukurti(s.id, 'JavaScript', 6);
  assert.strictEqual(d.pavadinimas, 'JavaScript');
  assert.strictEqual(d.kreditai, 6);
  assert.strictEqual(d.studento_id, s.id);
});

test('Kaskadinis istrynimas - pasalinus studenta istrinami dalykai', () => {
  const s = Studentas.sukurti('Kaskad', 'Testas', 2);
  Dalykas.sukurti(s.id, 'Matematika', 5);
  Dalykas.sukurti(s.id, 'Fizika', 4);
  Studentas.istrinti(s.id);
  const dalykai = Dalykas.gautiPagalStudenta(s.id);
  assert.strictEqual(dalykai.length, 0);
});