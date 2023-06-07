const fs = require('fs/promises')
const path = require("path");
const crypto = require("crypto");
const contactsPath = path.join(__dirname, "contacts.json");

const writeContacts = async (contact) =>
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));

const listContacts = async () => {
  const allContacts = await fs.readFile(contactsPath);
  return JSON.parse(allContacts);
}

const getContactById = async (contactId) => {
    const allContacts = await listContacts();
    const contact = allContacts.find((contact) => contact.id === contactId);
    return contact || null;
}

const removeContact = async (contactId) => {
    const allContacts = await listContacts();
    const index = allContacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const [result] = allContacts.splice(index, 1);
    await writeContacts(allContacts);
    return result;
}

const addContact = async (body) => {
    const allContacts = await listContacts();
    const newContact = { id: crypto.randomUUID(), ...body };
    allContacts.push(newContact);
    await writeContacts(allContacts);
    return newContact;
}

const updateContact = async (contactId, body) => {
    const allContacts = await listContacts();
    const index = allContacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }
    allContacts[index] = { contactId, ...body };
    await writeContacts(allContacts);
    return allContacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
