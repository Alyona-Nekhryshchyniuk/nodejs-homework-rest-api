const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  paginatedlistContacts,
  filteredlistContacts,
  spesificListContacts,
} = require("../services/contacts");
const ErrorHandler = require("../helpers/ErrorHandler");
const {
  contactsJOISchema: schema,
  favoriteFieldSchema,
} = require("../helpers/schema.js");

const getAllContactsController = async (req, res, next) => {
  let list;
  const arr = Object.keys(req.query);

  if (arr.includes("limit") && arr.includes("favorite")) {
    const { limit, page, favorite } = req.query;
    list = await spesificListContacts(+limit, +page, favorite);
  } else if (arr.includes("page" || "limit")) {
    const { limit, page } = req.query;
    list = await paginatedlistContacts(+limit, +page);
  } else if (arr.includes("favorite")) {
    const { favorite } = req.query;
    list = await filteredlistContacts(favorite);
  } else {
    list = await listContacts();
  }
  if (!list) {
    throw ErrorHandler(400, "Query params are incorrect");
  }
  res.json(list);
};

const getContactByIdController = async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    throw ErrorHandler(404, "Not found");
  }
  res.status(200).send(contact);
};

const addContactController = async (req, res, next) => {
  console.log(req.user);
  const { error } = schema.validate(req.body);
  if (error) {
    throw ErrorHandler(400, error.message);
  }

  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
};

const deleteContactByIdController = async (req, res, next) => {
  const successMes = await removeContact(req.params.contactId);
  if (!successMes) {
    throw ErrorHandler(404, "Not found");
  }
  res.send(successMes);
};

const updateContactController = async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw ErrorHandler(400, error.message);
  }
  const updatedContact = await updateContact(req.params.contactId, req.body);
  if (!updatedContact) {
    throw ErrorHandler(404, "Not found");
  }
  res.json(updatedContact);
};

const updateStatusContactController = async (req, res, next) => {
  const { error } = favoriteFieldSchema.validate(req.body);
  if (error) {
    throw ErrorHandler(400, error.message);
  }
  const updatedContact = await updateStatusContact(
    req.params.contactId,
    req.body
  );
  if (!updatedContact) {
    throw ErrorHandler(404, "Not found");
  }
  res.json(updatedContact);
};

module.exports = {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  deleteContactByIdController,
  updateContactController,
  updateStatusContactController,
};
