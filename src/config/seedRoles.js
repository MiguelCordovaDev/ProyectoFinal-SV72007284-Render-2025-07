const { Role, ROLES } = require("../models");

async function seedRoles() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Role.insertMany(ROLES.map((name) => ({ name })));
      console.log("Roles creados correctamente");
    }
  } catch (err) {
    console.error("Error inicializando roles:", err);
  }
}

module.exports = seedRoles;
