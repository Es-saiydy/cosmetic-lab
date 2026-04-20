const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const db = require("../config/db");

dotenv.config();

const isBcryptHash = (pwd) =>
  typeof pwd === "string" &&
  pwd.length === 60 &&
  /^\$2[aby]\$/.test(pwd);

const hashAdminPasswords = async () => {
  try {
    const result = await db.query(
      "SELECT id_admin, email, mot_de_passe FROM administrateur"
    );

    if (result.rows.length === 0) {
      console.log("Aucun admin trouvé en base.");
      return;
    }

    let updated = 0;
    let skipped = 0;

    for (const admin of result.rows) {
      if (isBcryptHash(admin.mot_de_passe)) {
        console.log(`⏭️  ${admin.email} — déjà hashé, skip.`);
        skipped++;
        continue;
      }

      const hashed = await bcrypt.hash(admin.mot_de_passe, 10);

      await db.query(
        "UPDATE administrateur SET mot_de_passe = $1 WHERE id_admin = $2",
        [hashed, admin.id_admin]
      );

      console.log(`✅ ${admin.email} — mot de passe hashé.`);
      updated++;
    }

    console.log(`\n✨ Terminé : ${updated} mis à jour, ${skipped} ignorés.`);
  } catch (error) {
    console.error("❌ Erreur :", error.message);
  } finally {
    process.exit(0);
  }
};

hashAdminPasswords();