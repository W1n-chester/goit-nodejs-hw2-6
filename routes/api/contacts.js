const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId, authenticate } = require('../../middlewares');

const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', authenticate, ctrl.listContacts);

router.get('/:contactId', isValidId, ctrl.getContactById);

router.post('/', authenticate, validateBody(schemas.contactAddSchema), ctrl.addContact);

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.contactAddSchema), ctrl.updateContact);

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact);

module.exports = router;
