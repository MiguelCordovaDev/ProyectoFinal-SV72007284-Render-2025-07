const { authJwt, validateRequest } = require("../middlewares");
const controller = require("../controllers/checkout.controller");

const { checkoutSessionSchema } = require("../validations/checkout.validation");

module.exports = (app) => {
  // Crear sesión de pago Stripe
  app.post(
    "/api/checkout/session",
    [authJwt.verifyToken, validateRequest.validateBody(checkoutSessionSchema)],
    controller.createCheckoutSession
  );

  // Stripe webhook
  app.post("/api/checkout/webhook", controller.stripeWebhook);
};
