const Product = require("../models/product.model");

class ProductController {
  // Crear producto (solo admin)
  async createProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error al crear producto", error: err.message });
    }
  }

  // Obtener todos los productos
  async findAll(req, res) {
    try {
      const products = await Product.find();
      return res.json(products);
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener productos" });
    }
  }

  // Obtener producto por ID
  async findOne(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });
      return res.json(product);
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener producto" });
    }
  }

  // Actualizar
  async updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });
      return res.json(product);
    } catch (err) {
      return res.status(500).json({ message: "Error al actualizar producto" });
    }
  }

  // Eliminar
  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Producto no encontrado" });
      return res.json({ message: "Producto eliminado correctamente" });
    } catch (err) {
      return res.status(500).json({ message: "Error al eliminar producto" });
    }
  }
}

module.exports = new ProductController();
