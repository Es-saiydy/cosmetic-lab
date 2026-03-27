const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { nom, prenom, email, mot_de_passe } = req.body;
  try {
    const hashed = await bcrypt.hash(mot_de_passe, 10);
    const result = await db.query(
      'INSERT INTO utilisateur (nom, prenom, email, mot_de_passe) VALUES ($1, $2, $3, $4) RETURNING id_utilisateur',
      [nom, prenom, email, hashed]
    );
    res.status(201).json({ message: 'Utilisateur créé', id: result.rows[0].id_utilisateur });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const result = await db.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const token = jwt.sign({ id: user.id_utilisateur }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id_utilisateur, nom: user.nom, prenom: user.prenom, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };