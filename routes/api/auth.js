const express = require("express");
const router = new express.Router();
const tryCatchMiddleware = require("../../middlewares/tryCatchMiddleware");
const isTokenValidMiddleware = require("../../middlewares/isTokenValidMiddleware");

const {
  registerController,
  loginController,
  logoutController,
  currentController,
  updateSubscriptionController,
} = require("../../controllers/userControllers");

router.post("/register", tryCatchMiddleware(registerController));

router.post("/login", tryCatchMiddleware(loginController));

router.post(
  "/logout",
  isTokenValidMiddleware(tryCatchMiddleware(logoutController))
);

router.get(
  "/current",
  isTokenValidMiddleware(tryCatchMiddleware(currentController))
);

router.patch(
  "/",
  isTokenValidMiddleware(tryCatchMiddleware(updateSubscriptionController))
);

module.exports = { authRouter: router };
