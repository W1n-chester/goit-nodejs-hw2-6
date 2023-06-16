const { Schema, model } = require('mongoose');
const { hendleMongooseError } = require('../helpers');
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
      required: true,
    },
  },
  { versionKey: false }
);

contactSchema.post('save', hendleMongooseError);
const Contact = model('contact', contactSchema);
module.exports = {
  Contact,
};
