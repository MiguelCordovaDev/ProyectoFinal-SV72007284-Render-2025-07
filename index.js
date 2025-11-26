require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieSession = require("cookie-session");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

app.use(
  "/api/",
  rateLimit({
    windowMs: 60_000,
    max: 100,
  })
);

app.use(
  cookieSession({
    name: "auth-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
  })
);

require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/products.routes")(app);
require("./src/routes/cart.routes")(app);
require("./src/routes/coupon.routes")(app);
require("./src/routes/checkout.routes")(app);

const db = require("./src/models");

db.mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    db.init();
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.send("Hola Alexander, desde Render!");
});

app.get("/success", (req, res) => {
  res.send("<h1>Pago exitoso</h1>");
});

app.get("/cancel", (req, res) => {
  res.send("<h1>Pago cancelado</h1>");
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
