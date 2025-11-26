const { authJwt, validateRequest } = require("../middlewares");
const controller = require("../controllers/cart.controller");

const {
  addToCartSchema,
  updateCartItemSchema,
} = require("../validations/cart.validation");

module.exports = (app) => {
  // Obtener carrito del usuario
  app.get("/api/cart", [authJwt.verifyToken], controller.getCart);

  // Agregar al carrito
  app.post(
    "/api/cart",
    [authJwt.verifyToken, validateRequest.validateBody(addToCartSchema)],
    controller.addToCart
  );

  // Actualizar cantidad
  app.put(
    "/api/cart/:itemId",
    [authJwt.verifyToken, validateRequest.validateBody(updateCartItemSchema)],
    controller.updateCartItem
  );

  // Eliminar item
  app.delete(
    "/api/cart/:itemId",
    [authJwt.verifyToken],
    controller.removeCartItem
  );

  // Vaciar carrito
  app.delete("/api/cart", [authJwt.verifyToken], controller.clearCart);
};
