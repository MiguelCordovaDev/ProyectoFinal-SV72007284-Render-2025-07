const User = require("../models/user.model");

exports.allAccess = (req, res) => {
  res.status(200).json({ message: "Contenido público" });
};

exports.onlyUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Contenido solo para usuarios autenticados",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.onlyModerator = (req, res) => {
  res.status(200).json({
    message: "Contenido exclusivo de moderador",
  });
};

exports.onlyAdmin = (req, res) => {
  res.status(200).json({
    message: "Contenido exclusivo de administrador",
  });
};
