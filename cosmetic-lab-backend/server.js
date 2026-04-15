const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend Cosmetic Lab OK'));

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Connexion PostgreSQL réussie',
      serverTime: result.rows[0].now
    });
  } catch (error) {
    console.error('Erreur test DB :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur connexion PostgreSQL',
      error: error.message
    });
  }
});

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/games', require('./routes/game.routes'));
app.use("/api/admin/auth", require("./routes/adminAuth.routes"));
app.use('/api/admin', require('./routes/admin.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));