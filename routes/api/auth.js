const express = require("express");
const router = new express.Router();
const tryCatchMiddleware = require("../../middlewares/tryCatchMiddleware");
const isTokenValidMiddleware = require("../../middlewares/isTokenValidMiddleware");
const multer = require("multer");
const path = require("path");

const multerConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multerConfig });

const {
  registerController,
  loginController,
  logoutController,
  currentController,
  updateSubscriptionController,
  updateAvatarController,
  verifyMailController,
  dublicateMailController,
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

router.get(
  "/verify/:verificationToken",
  tryCatchMiddleware(verifyMailController)
);

router.post("/verify", tryCatchMiddleware(dublicateMailController));

router.patch(
  "/",
  isTokenValidMiddleware(tryCatchMiddleware(updateSubscriptionController))
);

router.patch(
  "/avatars",
  upload.single("avatar"),
  isTokenValidMiddleware(tryCatchMiddleware(updateAvatarController))
);

module.exports = { authRouter: router };
