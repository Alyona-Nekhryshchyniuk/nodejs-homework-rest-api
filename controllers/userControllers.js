const {
  registerUser,
  findUserByMail,
  updateUserSubscription,
  updateUserVerificationStatus,
} = require("../services/user");
const fs = require("fs/promises");
const path = require("path");
const ErrorHandler = require("../helpers/ErrorHandler");
const {
  userJOISchema,
  emailJOISchema,
  subscriptionFieldSchema,
} = require("../helpers/schema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var Jimp = require("jimp");
const sendMail = require("../helpers/sendMail");

const registerController = async (req, res) => {
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

const loginController = async (req, res) => {
  const { error } = userJOISchema.validate(req.body);
  if (error) throw ErrorHandler(400, error.message);

  const { email, password } = req.body;
  const user = await findUserByMail(email);

  if (
    !user ||
    !user.verify ||
    !(await bcrypt.compare(password, user.password))
  ) {
    throw ErrorHandler(401, "Email/password is wrong or email isn't verified");
  }
  const { _id } = user;
  const { SECRET } = process.env;
  const token = jwt.sign({ _id }, SECRET);
  req.user = { ...user, token };

  res.json({
    token,
    user: {
      email: user.email,
      subscription: "starter",
    },
  });
};

const logoutController = (req, res) => {
  req.headers.authorization = "";
  req.user.token = "";
  res.sendStatus(204);
};

const currentController = (req, res) => {
  const { email, subscription } = req.user._doc;
  res.json({ email, subscription });
};

const updateSubscriptionController = async (req, res) => {
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

const updateAvatarController = async (req, res) => {
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

const verifyMailController = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await updateUserVerificationStatus(verificationToken);

  if (!user) {
    throw ErrorHandler(404, "Not found");
  }

  res.format({
    json: () => {
      res.json({ message: "Verification successful" });
    },
    html: () => {
      res.render("index", { message: "Verification successful" });
    },
  });
};

const dublicateMailController = async (req, res) => {
  const { error } = emailJOISchema.validate(req.body);

  if (error) throw ErrorHandler(400, error.message);

  const { email } = req.body;
  const user = await findUserByMail(email);

  if (user.verify) {
    throw ErrorHandler(400, "Verification has already been passed");
  }

  // const verificationToken = uuidv4();
  await sendMail(email, user.verificationToken);

  res.json({ message: "Verification email sent" });
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  currentController,
  updateSubscriptionController,
  updateAvatarController,
  verifyMailController,
  dublicateMailController,
};
