const Coupon = require("../models/coupon.model");

class CouponController {
  async createCoupon(req, res) {
    try {
      const { code, discountPercentage, expiresAt } = req.body;

      const exists = await Coupon.findOne({ code });
      if (exists)
        return res.status(400).json({ message: "Ese cupón ya existe" });

      const coupon = await Coupon.create({
        code,
        discountPercentage,
        expiresAt: new Date(expiresAt),
        createdBy: req.userId,
      });

      return res.status(201).json(coupon);
    } catch (err) {
      return res.status(500).json({ message: "Error al crear cupón" });
    }
  }

  async validateCoupon(req, res) {
    try {
      const { code } = req.body;

      const coupon = await Coupon.findOne({ code });
      if (!coupon)
        return res.status(404).json({ message: "Cupón no encontrado" });

      if (coupon.expiresAt < new Date()) {
        return res.status(400).json({ message: "Cupón expirado" });
      }

      return res.json(coupon);
    } catch (err) {
      return res.status(500).json({ message: "Error al validar cupón" });
    }
  }
}

module.exports = new CouponController();
