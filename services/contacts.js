const fs = require("fs/promises");
const path = require("path");
const { Contact } = require("../helpers/schema");
const ErrorHandler = require("../helpers/ErrorHandler");

// listContacts
const listContacts = async () => {
  return await Contact.find({});
};

// paginatedlistContacts
const paginatedlistContacts = async (limit = "", page = "") => {
  let skip = 0;
  if (page > 1) skip = (page - 1) * limit;
  return await Contact.find({}).limit(limit).skip(skip);
};

// listContacts
const filteredlistContacts = async (favoriteBool) => {
  if (favoriteBool !== "true" && favoriteBool !== "false") return;
  return await Contact.find({ favorite: favoriteBool });
};

// queryListContacts;
const spesificListContacts = async (limit, page, favorite) => {
  if (favorite !== "true" && favorite !== "false") return;
  const list = await paginatedlistContacts(limit, page);
  if (!list.length) return list;
  const favoriteBool = favorite === "true" ? true : false;
  return list.filter((contact) => contact["favorite"] === favoriteBool);
};

// getContactById
const getContactById = async (contactId) => {
  return await Contact.findById({ _id: contactId });
};

// removeContact
const removeContact = async (contactId) => {
  const foundContact = await Contact.findByIdAndRemove({ _id: contactId });
  if (!foundContact) return;
  return { message: "contact deleted" };
};

// addContact
const addContact = async ({ name, email, phone }) => {
  return await Contact.create({ name, email, phone });
};

// updateContact
const updateContact = async (contactId, { name, email, phone }) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId },
    { name, email, phone },
    { new: true }
  );
};

// updateStatusContact (favorite field)
const updateStatusContact = async (contactId, { favorite }) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId },
    { favorite },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  paginatedlistContacts,
  filteredlistContacts,
  spesificListContacts,
};
