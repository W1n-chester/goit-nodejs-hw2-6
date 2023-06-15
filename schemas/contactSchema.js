const Joi = require('joi');

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': `name must be exist`,
  }),
  email: Joi.string().required().messages({
    'any.required': `email must be exist`,
  }),
  phone: Joi.string().required().messages({
    'any.required': `phone must be exist`,
  }),
  favorite: Joi.boolean(),
});
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactSchemas = {
  contactAddSchema,
  updateFavoriteSchema,
};
module.exports = contactSchemas;
