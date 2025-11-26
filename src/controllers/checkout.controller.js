const Stripe = require("stripe");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coupon.model");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class CheckoutController {
  async createCheckoutSession(req, res) {
    try {
      const { couponCode } = req.body;

      const cart = await Cart.findOne({ user: req.userId }).populate(
        "items.product"
      );

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
      }

      let total = cart.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);

      let coupon = null;

      if (couponCode) {
        coupon = await Coupon.findOne({ code: couponCode });
        if (!coupon || coupon.expiresAt < new Date()) {
          return res.status(400).json({ message: "Cupón inválido o expirado" });
        }

        cart.coupon = coupon._id;
        await cart.save();

        total -= (total * coupon.discountPercentage) / 100;
      }

      const stripeCoupon = couponCode
        ? await stripe.coupons.create({
            percent_off: coupon.discountPercentage,
            duration: "once",
          })
        : null;

      // Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: cart.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.product.name },
            unit_amount: Math.round(item.product.price * 100),
          },
          quantity: item.quantity,
        })),
        discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : [],
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });

      return res.json({ url: session.url });
    } catch (error) {
      return res.status(500).json({
        message: "Error creando sesión de pago",
        error: error.message,
      });
    }
  }

  async stripeWebhook(req, res) {
    res.sendStatus(200);
  }
}

module.exports = new CheckoutController();
