const Joi = require("joi");

exports.createCouponSchema = Joi.object({
  code: Joi.string().uppercase().min(3).max(20).required(),
  discountPercentage: Joi.number().min(1).max(90).required(),
  expiresAt: Joi.date().optional(),
});

exports.validateCouponSchema = Joi.object({
  code: Joi.string().uppercase().required(),
});
