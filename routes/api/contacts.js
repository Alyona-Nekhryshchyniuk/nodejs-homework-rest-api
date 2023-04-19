const express = require("express");
const router = new express.Router();
const tryCatchMiddleware = require("../../middlewares/tryCatchMiddleware");
const isTokenValidMiddleware = require("../../middlewares/isTokenValidMiddleware");

const {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  deleteContactByIdController,
  updateContactController,
  updateStatusContactController,
} = require("../../controllers/contactsControllers");

router.get("/", tryCatchMiddleware(getAllContactsController));

router.get(
  "/:contactId",
  isTokenValidMiddleware(tryCatchMiddleware(getContactByIdController))
);

router.post(
  "/",
  isTokenValidMiddleware(tryCatchMiddleware(addContactController))
);

router.delete(
  "/:contactId",
  isTokenValidMiddleware(tryCatchMiddleware(deleteContactByIdController))
);

router.put(
  "/:contactId",
  isTokenValidMiddleware(tryCatchMiddleware(updateContactController))
);

router.patch(
  "/:contactId",
  isTokenValidMiddleware(tryCatchMiddleware(updateStatusContactController))
);

module.exports = { contactsRouter: router };
