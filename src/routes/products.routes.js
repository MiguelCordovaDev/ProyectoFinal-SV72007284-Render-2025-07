const { authJwt, validateRequest } = require("../middlewares");
const controller = require("../controllers/product.controller");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/product.validation");

module.exports = (app) => {
  // Crear producto (solo admin)
  app.post(
    "/api/products",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      validateRequest.validateBody(createProductSchema),
    ],
    controller.createProduct
  );

  // Obtener todos
  app.get("/api/products", controller.findAll);

  // Obtener uno
  app.get("/api/products/:id", controller.findOne);

  // Actualizar producto
  app.put(
    "/api/products/:id",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      validateRequest.validateBody(updateProductSchema),
    ],
    controller.updateProduct
  );

  // Eliminar producto
  app.delete(
    "/api/products/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteProduct
  );
};
