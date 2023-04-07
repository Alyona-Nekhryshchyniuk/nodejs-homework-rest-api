const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("models", "contacts.json");

// listContacts
const listContacts = async () => {
  return await fs.readFile(contactsPath, "utf-8");
};

// getContactById
const getContactById = async (contactId) => {
  const fileContent = await listContacts();
  const contactArray = JSON.parse(fileContent);
  const foundContact = contactArray.find((contact) => contact.id === contactId);
  return foundContact;
};

// removeContact
const removeContact = async (contactId) => {
  const fileContent = await listContacts();
  const contactArray = JSON.parse(fileContent);
  const foundContact = contactArray.find((contact) => contact.id === contactId);

  const indexOfFoundContactById = contactArray.findIndex(
    (oneOfconts) => oneOfconts === foundContact
  );
  if (indexOfFoundContactById > 0) {
    const listWithoutDeletedContact = contactArray.filter(
      (_, ind) => ind !== indexOfFoundContactById
    );
    fs.writeFile(
      contactsPath,
      JSON.stringify(listWithoutDeletedContact, null, 2)
    );
  }
  if (!foundContact) return;
  return { message: "contact deleted" };
};

// addContact
const addContact = async ({ name, email, phone }) => {
  const fileContent = await listContacts();
  const contactArray = JSON.parse(fileContent);
  const addedContact = { id: nanoid(), name, email, phone };
  const listWithAddedContact = [...contactArray, addedContact];
  fs.writeFile(contactsPath, JSON.stringify(listWithAddedContact, null, 2));

  return addedContact;
};

// updateContact
const updateContact = async (contactId, { name, email, phone }) => {
  const fileContent = await listContacts();
  const contactArray = JSON.parse(fileContent);
  const foundContact = contactArray.find((contact) => contact.id === contactId);
  if (foundContact) {
    const indexOfFoundContactById = contactArray.findIndex(
      (oneOfconts) => oneOfconts === foundContact
    );
    console.log(`indexOfFoundContactById ${indexOfFoundContactById}`);
    const updatedContact = { ...foundContact, name, email, phone };
    contactArray.splice(indexOfFoundContactById, 1, updatedContact);
    fs.writeFile(contactsPath, JSON.stringify(contactArray, null, 2));
    return updatedContact;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
