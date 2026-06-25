<!DOCTYPE html>
<html lang="lt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studentu registras</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Studentu registras</h1>
  </header>

  <main>
    <section class="forma-sekcija">
      <h2 id="formos-antraste">Pridėti studentą</h2>
      <form id="studento-forma">
        <input type="hidden" id="studento-id">
        <div class="lauko-eilute">
          <label for="vardas">Vardas</label>
          <input type="text" id="vardas" name="vardas" required>
        </div>
        <div class="lauko-eilute">
          <label for="pavarde">Pavardė</label>
          <input type="text" id="pavarde" name="pavarde" required>
        </div>
        <div class="lauko-eilute">
          <label for="kursas">Kursas</label>
          <input type="number" id="kursas" name="kursas" min="1" max="6" required>
        </div>
        <div class="mygtukai">
          <button type="submit" id="issaugoti-btn">Išsaugoti</button>
          <button type="button" id="atsaukti-btn" class="slepti">Atšaukti</button>
        </div>
      </form>
      <div id="pranesimas"></div>
    </section>

    <section class="filtrai-sekcija">
      <h2>Filtrai</h2>
      <div class="filtrai">
        <input type="text" id="filtras-vardas" placeholder="Vardas">
        <input type="text" id="filtras-pavarde" placeholder="Pavardė">
        <input type="number" id="filtras-kursas" placeholder="Kursas" min="1" max="6">
        <input type="number" id="filtras-id" placeholder="ID" min="1">
        <button type="button" id="filtruoti-btn">Filtruoti</button>
        <button type="button" id="isvalyti-btn">Išvalyti</button>
      </div>
    </section>

    <section class="sarasas-sekcija">
      <h2>Studentų sąrašas</h2>
      <div class="lentele-wrap">
        <table id="studentu-lentele">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vardas</th>
              <th>Pavardė</th>
              <th>Kursas</th>
              <th>Dalykai</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody id="studentu-kunas">
          </tbody>
        </table>
      </div>
    </section>

    <section id="detales-sekcija" class="slepti">
      <h2>Studento detalės</h2>
      <div id="studento-detales"></div>

      <h3>Mokomieji dalykai</h3>
      <form id="dalyko-forma">
        <input type="hidden" id="dalyko-studento-id">
        <input type="hidden" id="dalyko-id">
        <div class="lauko-eilute">
          <label for="dalyko-pavadinimas">Pavadinimas</label>
          <input type="text" id="dalyko-pavadinimas" required>
        </div>
        <div class="lauko-eilute">
          <label for="dalyko-kreditai">Kreditai</label>
          <input type="number" id="dalyko-kreditai" min="1" max="30" required>
        </div>
        <div class="mygtukai">
          <button type="submit" id="dalyko-issaugoti-btn">Pridėti dalyką</button>
          <button type="button" id="dalyko-atsaukti-btn" class="slepti">Atšaukti</button>
        </div>
      </form>

      <ul id="dalyku-sarasas"></ul>

      <button type="button" id="uzdaryti-detales-btn">Uždaryti detales</button>
    </section>
  </main>

  <footer>
    <p>Studentu registras - 2026</p>
  </footer>

  <script src="app.js"></script>
</body>
</html>