const express = require('express');
const cors = require('cors');
const path = require('path');

const studentaiRoutes = require('./routes/studentaiRoutes');
const dalykaiRoutes = require('./routes/dalykaiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/studentai', studentaiRoutes);
app.use('/api/dalykai', dalykaiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Neegzistuojantis API taskas' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Neteisingas JSON formatas' });
  }
  res.status(500).json({ error: 'Vidine serverio klaida' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveris veikia: http://localhost:${PORT}`);
  });
}

module.exports = app;
