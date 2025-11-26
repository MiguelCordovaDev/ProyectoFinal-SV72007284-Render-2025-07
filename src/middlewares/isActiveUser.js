const db = require("../models");
const User = db.user;

exports.isActiveUser = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user || user.status === "inactive")
    return res.status(403).send({ message: "Usuario inactivo" });

  next();
};
