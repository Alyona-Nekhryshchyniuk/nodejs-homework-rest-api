// const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contacts");
const ErrorHandler = require("../helpers/ErrorHandler");
const schema = require("../helpers/schema.js");
const contact = require("../helpers/schema.js");

// contact - model for mongoose methods

const getAllContactsController = async (req, res, next) => {
  const list = await listContacts();
  res.send(list);
};

const getContactByIdController = async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    throw ErrorHandler(404, "Not found");
  }
  res.status(200).send(contact);
};

const addContactController = async (req, res, next) => {
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

module.exports = {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  deleteContactByIdController,
  updateContactController,
};