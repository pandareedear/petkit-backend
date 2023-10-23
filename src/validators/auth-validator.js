const Joi = require("Joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{4,30}$/)
    .trim()
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const addressSchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  mobile: Joi.string()
    .pattern(/^[0-9]{9,10}$/)
    .required()
    .trim(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  zipCode: Joi.string()
    .pattern(/^[0-9]{5}$/)
    .required(),
  country: Joi.string().required(),
  province: Joi.string().required(),
});

const createProductSchema = Joi.object({
  enumCategory: Joi.string().trim().required(),
  productName: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
});

exports.registerSchema = registerSchema;
exports.loginSchema = loginSchema;
exports.addressSchema = addressSchema;
exports.createProductSchema = createProductSchema;
