const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

class CartController {
  // Obtener carrito del usuario
  async getCart(req, res) {
    try {
      const cart = await Cart.findOne({ user: req.userId }).populate(
        "items.product"
      );

      if (!cart) return res.json({ items: [] });

      return res.json(cart);
    } catch (err) {
      return res.status(500).json({ message: "Error al obtener carrito" });
    }
  }

  // Agregar producto
  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;

      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Producto no existe" });

      let cart = await Cart.findOne({ user: req.userId });

      if (!cart) {
        cart = await Cart.create({
          user: req.userId,
          items: [{ product: productId, quantity }],
        });
      } else {
        const item = cart.items.find((i) => i.product.toString() === productId);
        if (item) item.quantity += quantity;
        else cart.items.push({ product: productId, quantity });

        await cart.save();
      }

      return res.json(cart);
    } catch (err) {
      return res.status(500).json({ message: "Error al agregar al carrito" });
    }
  }

  // Actualizar cantidad de un item del carrito
  async updateCartItem(req, res) {
    try {
      const { quantity } = req.body;
      const { itemId } = req.params;

      const cart = await Cart.findOne({ user: req.userId });
      if (!cart)
        return res.status(404).json({ message: "Carrito no encontrado" });

      const item = cart.items.id(itemId);
      if (!item) return res.status(404).json({ message: "Item no encontrado" });

      item.quantity = quantity;
      await cart.save();

      return res.json(cart);
    } catch (err) {
      return res.status(500).json({ message: "Error al actualizar item" });
    }
  }

  // Eliminar item del carrito
  async removeCartItem(req, res) {
    try {
      const { itemId } = req.params;

      const cart = await Cart.findOne({ user: req.userId });
      if (!cart)
        return res.status(404).json({ message: "Carrito no encontrado" });

      cart.items = cart.items.filter((i) => i._id.toString() !== itemId);

      await cart.save();

      return res.json(cart);
    } catch (err) {
      return res.status(500).json({ message: "Error al eliminar item" });
    }
  }

  // Vaciar carrito
  async clearCart(req, res) {
    try {
      await Cart.findOneAndUpdate({ user: req.userId }, { items: [] });

      return res.json({ message: "Carrito vaciado" });
    } catch (err) {
      return res.status(500).json({ message: "Error al vaciar carrito" });
    }
  }
}

module.exports = new CartController();
