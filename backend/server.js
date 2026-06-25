const API = '/api';

const forma = document.getElementById('studento-forma');
const formosAntraste = document.getElementById('formos-antraste');
const studentoIdLaukas = document.getElementById('studento-id');
const vardasLaukas = document.getElementById('vardas');
const pavardeLaukas = document.getElementById('pavarde');
const kursasLaukas = document.getElementById('kursas');
const issaugotiBtn = document.getElementById('issaugoti-btn');
const atsauktiBtn = document.getElementById('atsaukti-btn');
const pranesimas = document.getElementById('pranesimas');

const filtrasVardas = document.getElementById('filtras-vardas');
const filtrasPavarde = document.getElementById('filtras-pavarde');
const filtrasKursas = document.getElementById('filtras-kursas');
const filtrasId = document.getElementById('filtras-id');
const filtruotiBtn = document.getElementById('filtruoti-btn');
const isvalytiBtn = document.getElementById('isvalyti-btn');

const studentuKunas = document.getElementById('studentu-kunas');

const detalesSekcija = document.getElementById('detales-sekcija');
const studentoDetales = document.getElementById('studento-detales');
const dalykoForma = document.getElementById('dalyko-forma');
const dalykoStudentoId = document.getElementById('dalyko-studento-id');
const dalykoId = document.getElementById('dalyko-id');
const dalykoPavadinimas = document.getElementById('dalyko-pavadinimas');
const dalykoKreditai = document.getElementById('dalyko-kreditai');
const dalykoIssaugotiBtn = document.getElementById('dalyko-issaugoti-btn');
const dalykoAtsauktiBtn = document.getElementById('dalyko-atsaukti-btn');
const dalykuSarasas = document.getElementById('dalyku-sarasas');
const uzdarytiDetalesBtn = document.getElementById('uzdaryti-detales-btn');

function rodytiPranesima(tekstas, tipas) {
  pranesimas.textContent = tekstas;
  pranesimas.className = tipas;
  setTimeout(() => {
    pranesimas.textContent = '';
    pranesimas.className = '';
  }, 4000);
}

async function uzklausa(url, metodas = 'GET', duomenys = null) {
  const opcijos = {
    method: metodas,
    headers: { 'Content-Type': 'application/json' }
  };
  if (duomenys) opcijos.body = JSON.stringify(duomenys);

  const atsakymas = await fetch(url, opcijos);

  if (atsakymas.status === 204) return null;

  const json = await atsakymas.json();
  if (!atsakymas.ok) {
    const klaidosTekstas = json.klaidos ? json.klaidos.join(', ') : (json.error || 'Klaida');
    throw new Error(klaidosTekstas);
  }
  return json;
}

async function gautiStudentus(filtrai = {}) {
  const parametrai = new URLSearchParams();
  if (filtrai.vardas) parametrai.append('vardas', filtrai.vardas);
  if (filtrai.pavarde) parametrai.append('pavarde', filtrai.pavarde);
  if (filtrai.course) parametrai.append('course', filtrai.course);
  if (filtrai.id) parametrai.append('id', filtrai.id);

  const url = `${API}/studentai${parametrai.toString() ? '?' + parametrai.toString() : ''}`;
  try {
    const studentai = await uzklausa(url);
    atvaizduotiStudentus(studentai);
  } catch (e) {
    rodytiPranesima('Nepavyko gauti studentu: ' + e.message, 'klaida');
  }
}

function atvaizduotiStudentus(studentai) {
  studentuKunas.innerHTML = '';

  if (studentai.length === 0) {
    const eilute = document.createElement('tr');
    eilute.innerHTML = '<td colspan="6" style="text-align:center;color:#888">Studentu nera</td>';
    studentuKunas.appendChild(eilute);
    return;
  }

  studentai.forEach(s => {
    const eilute = document.createElement('tr');
    eilute.innerHTML = `
      <td>${s.id}</td>
      <td>${iseskartuoti(s.vardas)}</td>
      <td>${iseskartuoti(s.pavarde)}</td>
      <td>${s.kursas}</td>
      <td>${s.dalykai ? s.dalykai.length : 0}</td>
      <td>
        <div class="veiksmai">
          <button class="detales-btn" data-id="${s.id}">Detalės</button>
          <button class="redaguoti-btn" data-id="${s.id}">Redaguoti</button>
          <button class="istrinti-btn pavojus" data-id="${s.id}">Pašalinti</button>
        </div>
      </td>
    `;
    studentuKunas.appendChild(eilute);
  });

  document.querySelectorAll('.detales-btn').forEach(btn => {
    btn.addEventListener('click', () => rodytiDetales(Number(btn.dataset.id)));
  });
  document.querySelectorAll('.redaguoti-btn').forEach(btn => {
    btn.addEventListener('click', () => pradetiRedagavima(Number(btn.dataset.id)));
  });
  document.querySelectorAll('.istrinti-btn').forEach(btn => {
    btn.addEventListener('click', () => istrintiStudenta(Number(btn.dataset.id)));
  });
}

function iseskartuoti(tekstas) {
  const div = document.createElement('div');
  div.textContent = tekstas;
  return div.innerHTML;
}

forma.addEventListener('submit', async (e) => {
  e.preventDefault();

  const duomenys = {
    vardas: vardasLaukas.value.trim(),
    pavarde: pavardeLaukas.value.trim(),
    kursas: Number(kursasLaukas.value)
  };

  try {
    const id = studentoIdLaukas.value;
    if (id) {
      await uzklausa(`${API}/studentai/${id}`, 'PUT', duomenys);
      rodytiPranesima('Studentas atnaujintas', 'sekme');
    } else {
      await uzklausa(`${API}/studentai`, 'POST', duomenys);
      rodytiPranesima('Studentas pridėtas', 'sekme');
    }
    atstatytiForma();
    gautiStudentus();
  } catch (e) {
    rodytiPranesima(e.message, 'klaida');
  }
});

function atstatytiForma() {
  forma.reset();
  studentoIdLaukas.value = '';
  formosAntraste.textContent = 'Pridėti studentą';
  issaugotiBtn.textContent = 'Išsaugoti';
  atsauktiBtn.classList.add('slepti');
}

atsauktiBtn.addEventListener('click', atstatytiForma);

async function pradetiRedagavima(id) {
  try {
    const studentas = await uzklausa(`${API}/studentai/${id}`);
    studentoIdLaukas.value = studentas.id;
    vardasLaukas.value = studentas.vardas;
    pavardeLaukas.value = studentas.pavarde;
    kursasLaukas.value = studentas.kursas;
    formosAntraste.textContent = `Redaguoti studentą #${studentas.id}`;
    issaugotiBtn.textContent = 'Atnaujinti';
    atsauktiBtn.classList.remove('slepti');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    rodytiPranesima(e.message, 'klaida');
  }
}

async function istrintiStudenta(id) {
  if (!confirm('Ar tikrai norite pašalinti šį studentą? Bus ištrinti ir visi jo dalykai.')) return;
  try {
    await uzklausa(`${API}/studentai/${id}`, 'DELETE');
    rodytiPranesima('Studentas pašalintas', 'sekme');
    gautiStudentus();
    if (detalesSekcija.dataset.studentoId == id) {
      detalesSekcija.classList.add('slepti');
    }
  } catch (e) {
    rodytiPranesima(e.message, 'klaida');
  }
}

filtruotiBtn.addEventListener('click', () => {
  const filtrai = {
    vardas: filtrasVardas.value.trim(),
    pavarde: filtrasPavarde.value.trim(),
    course: filtrasKursas.value,
    id: filtrasId.value
  };
  gautiStudentus(filtrai);
});

isvalytiBtn.addEventListener('click', () => {
  filtrasVardas.value = '';
  filtrasPavarde.value = '';
  filtrasKursas.value = '';
  filtrasId.value = '';
  gautiStudentus();
});

async function rodytiDetales(id) {
  try {
    const studentas = await uzklausa(`${API}/studentai/${id}`);
    detalesSekcija.dataset.studentoId = id;
    detalesSekcija.classList.remove('slepti');

    studentoDetales.innerHTML = `
      <p><strong>ID:</strong> ${studentas.id}</p>
      <p><strong>Vardas:</strong> ${iseskartuoti(studentas.vardas)}</p>
      <p><strong>Pavardė:</strong> ${iseskartuoti(studentas.pavarde)}</p>
      <p><strong>Kursas:</strong> ${studentas.kursas}</p>
    `;

    dalykoStudentoId.value = id;
    atstatytiDalykoForma();
    atvaizduotiDalykus(studentas.dalykai || []);

    detalesSekcija.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    rodytiPranesima(e.message, 'klaida');
  }
}

function atvaizduotiDalykus(dalykai) {
  dalykuSarasas.innerHTML = '';
  if (dalykai.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nėra priskirtų dalykų';
    li.style.color = '#888';
    dalykuSarasas.appendChild(li);
    return;
  }

  dalykai.forEach(d => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${iseskartuoti(d.pavadinimas)} (${d.kreditai} kreditai)</span>
      <span class="dalyko-mygtukai">
        <button class="redaguoti-dalyka-btn" data-id="${d.id}" data-pav="${iseskartuoti(d.pavadinimas)}" data-kred="${d.kreditai}">Redaguoti</button>
        <button class="istrinti-dalyka-btn pavojus" data-id="${d.id}">Šalinti</button>
      </span>
    `;
    dalykuSarasas.appendChild(li);
  });

  document.querySelectorAll('.redaguoti-dalyka-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      dalykoId.value = btn.dataset.id;
      dalykoPavadinimas.value = btn.dataset.pav;
      dalykoKreditai.value = btn.dataset.kred;
      dalykoIssaugotiBtn.textContent = 'Atnaujinti dalyką';
      dalykoAtsauktiBtn.classList.remove('slepti');
    });
  });

  document.querySelectorAll('.istrinti-dalyka-btn').forEach(btn => {
    btn.addEventListener('click', () => istrintiDalyka(Number(btn.dataset.id)));
  });
}

dalykoForma.addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentoId = dalykoStudentoId.value;
  const id = dalykoId.value;
  const duomenys = {
    pavadinimas: dalykoPavadinimas.value.trim(),
    kreditai: Number(dalykoKreditai.value)
  };

  try {
    if (id) {
      await uzklausa(`${API}/dalykai/${id}`, 'PUT', duomenys);
      rodytiPranesima('Dalykas atnaujintas', 'sekme');
    } else {
      await uzklausa(`${API}/dalykai/studentas/${studentoId}`, 'POST', duomenys);
      rodytiPranesima('Dalykas pridėtas', 'sekme');
    }
    atstatytiDalykoForma();
    rodytiDetales(Number(studentoId));
    gautiStudentus();
  } catch (e) {
    rodytiPranesima(e.message, 'klaida');
  }
});

function atstatytiDalykoForma() {
  dalykoId.value = '';
  dalykoPavadinimas.value = '';
  dalykoKreditai.value = '';
  dalykoIssaugotiBtn.textContent = 'Pridėti dalyką';
  dalykoAtsauktiBtn.classList.add('slepti');
}

dalykoAtsauktiBtn.addEventListener('click', atstatytiDalykoForma);

async function istrintiDalyka(id) {
  if (!confirm('Ar tikrai norite ištrinti šį dalyką?')) return;
  try {
    await uzklausa(`${API}/dalykai/${id}`, 'DELETE');
    rodytiPranesima('Dalykas ištrintas', 'sekme');
    const studentoId = dalykoStudentoId.value;
    rodytiDetales(Number(studentoId));
    gautiStudentus();
  } catch (e) {
    rodytiPranesima(e.message, 'klaida');
  }
}

uzdarytiDetalesBtn.addEventListener('click', () => {
  detalesSekcija.classList.add('slepti');
});

gautiStudentus();