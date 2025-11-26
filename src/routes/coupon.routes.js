const { authJwt, validateRequest } = require("../middlewares");
const controller = require("../controllers/coupon.controller");

const {
  createCouponSchema,
  validateCouponSchema,
} = require("../validations/coupon.validation");

module.exports = (app) => {
  // Crear cupón (admin)
  app.post(
    "/api/coupons",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      validateRequest.validateBody(createCouponSchema),
    ],
    controller.createCoupon
  );

  // Validar cupón antes del checkout
  app.post(
    "/api/coupons/validate",
    [authJwt.verifyToken, validateRequest.validateBody(validateCouponSchema)],
    controller.validateCoupon
  );
};
