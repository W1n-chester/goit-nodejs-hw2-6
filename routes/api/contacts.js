const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId } = require("../../middlewares");

const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', ctrl.listContacts);

router.get('/:contactId', isValidId, ctrl.getContactById);

router.post('/', validateBody(schemas.contactAddSchema), ctrl.addContact);

router.put(
  '/:contactId',
  isValidId,
  validateBody(schemas.contactAddSchema),
  ctrl.updateContact
);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

router.delete('/:contactId', isValidId, ctrl.removeContact);

module.exports = router;
