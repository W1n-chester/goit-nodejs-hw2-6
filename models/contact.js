const { Schema, model } = require("mongoose")
const Joi = require("joi");
const {hendleMongooseError} =  require("../helpers")
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false }
);

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `name must be exist`,
  }),
  email: Joi.string().required().messages({
    "any.required": `email must be exist`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `phone must be exist`,
  }),
  favorite: Joi.boolean(),
});
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  contactAddSchema,
  updateFavoriteSchema,
};

contactSchema.post("save", hendleMongooseError)
const Contact = model("contact", contactSchema)
module.exports = {
  Contact,
  schemas,
}