const Joi = require("joi");

exports.createProductSchema = Joi.object({
  name: Joi.string().min(3).max(120).required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  image: Joi.string().uri().optional(),
  category: Joi.string().max(80).optional(),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().min(3).max(120).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  image: Joi.string().uri().optional(),
  category: Joi.string().max(80).optional(),
});
