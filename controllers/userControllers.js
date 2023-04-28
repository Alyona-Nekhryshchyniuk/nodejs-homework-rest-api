const {
  registerUser,
  loginUser,
  updateUserSubscription,
} = require("../services/user");
const fs = require("fs/promises");
const path = require("path");
const ErrorHandler = require("../helpers/ErrorHandler");
const {
  userJOISchema,
  subscriptionFieldSchema,
} = require("../helpers/schema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var Jimp = require("jimp");

const registerController = async (req, res, next) => {
  const { error } = userJOISchema.validate(req.body);
  if (error) throw ErrorHandler(400, error.message);

  const user = await registerUser(req.body);

  if (!user) throw ErrorHandler(409, "Email in use");
  const { email, password } = user;

  res.status(201).json({
    user: {
      email,
      subscription: "starter",
    },
  });
};

const loginController = async (req, res, next) => {
  const { error } = userJOISchema.validate(req.body);
  if (error) throw ErrorHandler(400, error.message);

  const { email, password } = req.body;
  const user = await loginUser(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw ErrorHandler(401, "Email or password is wrong");
  }
  const { _id } = user;
  const { SECRET } = process.env;
  const token = jwt.sign({ _id }, SECRET);
  req.user = { ...user, token };
  console.log(token);

  res.json({
    token,
    user: {
      email: user.email,
      subscription: "starter",
    },
  });
};

const logoutController = (req, res, next) => {
  req.headers.authorization = "";
  req.user.token = "";
  res.sendStatus(204);
};

const currentController = (req, res, next) => {
  const { email, subscription } = req.user._doc;
  res.json({ email, subscription });
};

const updateSubscriptionController = async (req, res, next) => {
  const { error } = subscriptionFieldSchema.validate(req.body);
  if (error) {
    throw ErrorHandler(400, error.message);
  }

  const { subscription } = req.body;
  const { _id } = req.user._doc;

  const updatedUser = await updateUserSubscription(_id, subscription);

  if (!updatedUser) {
    throw ErrorHandler(404, "Not found");
  }
  res.json(updatedUser);
};

const updateAvatarController = async (req, res, next) => {
  console.log(req.file);
  const modifFileName = `${Math.random() * (999 - 1) + 1}${req.file.filename}`;
  const tempDirFullPath = path.resolve(req.file.path);
  const permDirFullPath = path.resolve("public", "avatars", modifFileName);
  const fullFilePathOnUserObj = path.join("avatars", modifFileName);

  Jimp.read(req.file.path, (err, img) => {
    if (err) throw err;
    img.resize(250, 250);
  });

  await fs.rename(tempDirFullPath, permDirFullPath);
  req.user._doc.avatarURL = fullFilePathOnUserObj;

  res.sendStatus(200);
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  currentController,
  updateSubscriptionController,
  updateAvatarController,
};
