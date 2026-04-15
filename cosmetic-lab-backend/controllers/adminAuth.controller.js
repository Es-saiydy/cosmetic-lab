const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM administrateur WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Admin non trouvé" });
    }

    const admin = result.rows[0];

    const validPassword = mot_de_passe === admin.mot_de_passe;

    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id_admin: admin.id_admin,
        email: admin.email,
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      admin: {
        id: admin.id_admin,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Erreur login admin :", error);
    res.status(500).json({ error: error.message });
  }
};