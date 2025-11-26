const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const Role = require("../models/role.model");
const Cart = require("../models/cart.model");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    let assignedRoles;
    if (roles && roles.length > 0) {
      assignedRoles = await Role.find({ name: { $in: roles } });
    } else {
      const userRole = await Role.findOne({ name: "user" });
      assignedRoles = [userRole];
    }

    newUser.roles = assignedRoles.map((r) => r._id);
    await newUser.save();

    // Crear carrito automáticamente
    const cart = new Cart({ user: newUser._id, items: [] });
    await cart.save();

    // Guardar carrito en user
    newUser.cart = cart._id;
    await newUser.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Error en signup:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña requeridos" });
    }

    const user = await User.findOne({ username }).populate("roles");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Guardar token en la cookie-session
    req.session.token = token;

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      accessToken: token,
    });
  } catch (err) {
    console.error("Error en signin:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

exports.signout = (req, res) => {
  try {
    req.session = null;
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error cerrando sesión" });
  }
};
