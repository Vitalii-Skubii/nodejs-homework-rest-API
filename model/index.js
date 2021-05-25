const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");
const contactsPath = path.join(__dirname, "contacts.json");
async function listContacts() {
  try {
    return JSON.parse(await fs.readFile(contactsPath));
  } catch (err) {
    return err.message;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));
    const findContact = await contacts.filter(
      ({ id }) => String(id) === String(contactId)
    );
    if (!findContact) {
      return;
    }
    return findContact;
  } catch (error) {
    return error.message;
  }
}

async function removeContact(contactId) {
  try {
    const response = await fs.readFile(contactsPath);
    const contacts = JSON.parse(response);
    const filteredContacts = contacts.filter(
      ({ id }) => String(id) !== String(contactId)
    );
    if (!filteredContacts) {
      return;
    }
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
    return filteredContacts;
  } catch (error) {
    return error.message;
  }
}

async function addContact(body) {
  try {
    const response = await fs.readFile(contactsPath);
    const contacts = JSON.parse(response);
    const contactNew = { id: uuid(), ...body };
    const contactsList = JSON.stringify([contactNew, ...contacts], null, "\t");

    await fs.writeFile(contactsPath, contactsList);
    return contactNew;
  } catch (error) {
    return error.message;
  }
}
const updateContact = async (contactId, body) => {
  try {
    const response = await fs.readFile(contactsPath);
    const contacts = JSON.parse(response);

    const findContact = await contacts.find(
      (contact) => String(contact.id) === String(contactId)
    );

    Object.assign(findContact, body);

    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    return findContact;
  } catch (error) {
    return error.message;
  }
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
