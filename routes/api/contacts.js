const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");
const ErrorHandler = require("../../helpers/ErrorHandler.js");
const schema = require("../../helpers/schema.js");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const list = await listContacts();
    res.send(list);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      throw ErrorHandler(404, "Not found");
    }
    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      throw ErrorHandler(400, error.message);
    }
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const successMes = await removeContact(req.params.contactId);
    if (!successMes) {
      throw ErrorHandler(404, "Not found");
    }
    res.send(successMes);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      throw ErrorHandler(400, error.message);
    }
    const updatedContact = await updateContact(req.params.contactId, req.body);
    if (!updatedContact) {
      throw ErrorHandler(404, "Not found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
