const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId, authenticate } = require('../../middlewares');

const { contactSchemas} = require('../../schemas');

const router = express.Router();

router.get('/', authenticate, ctrl.listContacts);

router.get('/:contactId', isValidId, ctrl.getContactById);

router.post('/', authenticate, validateBody(contactSchemas.contactAddSchema), ctrl.addContact);

router.put('/:contactId', authenticate, isValidId, validateBody(contactSchemas.contactAddSchema), ctrl.updateContact);

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(contactSchemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact);

module.exports = router;
