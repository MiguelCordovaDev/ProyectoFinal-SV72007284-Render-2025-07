const Joi = require("joi");

exports.checkoutSessionSchema = Joi.object({
  couponCode: Joi.string().uppercase().optional(),
});
