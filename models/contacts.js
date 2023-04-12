const fs = require("fs/promises");
const path = require("path");
const { contact } = require("../helpers/schema");

// contact - model for mongoose methods

// const contactsPath = path.resolve("models", "contacts.json");

// listContacts
const listContacts = async () => {
  // return await fs.readFile(contactsPath, "utf-8");
  return await contact.findd({});
};

// getContactById
const getContactById = async (contactId) => {
  // const fileContent = await listContacts();
  // const contactArray = JSON.parse(fileContent);
  // const foundContact = contactArray.find((contact) => contact.id === contactId);
  // return foundContact;
  return await contact.findById({ _id: contactId });
};

// removeContact
const removeContact = async (contactId) => {
  // const fileContent = await listContacts();
  // const contactArray = JSON.parse(fileContent);
  // const foundContact = contactArray.find((contact) => contact.id === contactId);

  // const indexOfFoundContactById = contactArray.findIndex(
  //   (oneOfconts) => oneOfconts === foundContact
  // );
  // if (indexOfFoundContactById > 0) {
  //   const listWithoutDeletedContact = contactArray.filter(
  //     (_, ind) => ind !== indexOfFoundContactById
  //   );
  //   fs.writeFile(
  //     contactsPath,
  //     JSON.stringify(listWithoutDeletedContact, null, 2)
  //   );
  // }
  const foundContact = await contact.findByIdAndRemove({ _id: contactId });
  if (!foundContact) return;
  return { message: "contact deleted" };
};

// addContact
const addContact = async ({ name, email, phone }) => {
  return await contact.create({ name, email, phone });
  // const fileContent = await listContacts();
  // const contactArray = JSON.parse(fileContent);
  // const addedContact = { id: nanoid(), name, email, phone };
  // const listWithAddedContact = [...contactArray, addedContact];
  // fs.writeFile(contactsPath, JSON.stringify(listWithAddedContact, null, 2));

  // return addedContact;
};

// updateContact
const updateContact = async (contactId, { name, email, phone }) => {
  // const fileContent = await listContacts();
  // const contactArray = JSON.parse(fileContent);
  // const foundContact = contactArray.find((contact) => contact.id === contactId);
  // if (foundContact) {
  //   const indexOfFoundContactById = contactArray.findIndex(
  //     (oneOfconts) => oneOfconts === foundContact
  //   );
  //   console.log(`indexOfFoundContactById ${indexOfFoundContactById}`);
  //   const updatedContact = { ...foundContact, name, email, phone };
  //   contactArray.splice(indexOfFoundContactById, 1, updatedContact);
  //   fs.writeFile(contactsPath, JSON.stringify(contactArray, null, 2));
  //   return updatedContact;
  // }
  return await contact.findOneAndUpdate(
    { _id: contactId },
    { name, email, phone },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
