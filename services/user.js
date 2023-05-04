const { User } = require("../helpers/schema");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../helpers/sendMail");

// register
const registerUser = async ({ email, password }) => {
  const avatarURL = gravatar.url(email);

  const emailAlreadyInDB = await User.findOne({ email });
  if (emailAlreadyInDB) return;

  const verificationToken = uuidv4();
  await sendMail(email, verificationToken);

  const user = await User.create({
    email,
    password,
    avatarURL,
    verificationToken,
  });
  return user;
};

// find By Mail
const findUserByMail = async (email) => {
  return await User.findOne({ email });
};

// get By Id
const getUserById = async (_id) => {
  return await User.findById({ _id });
};

// update Verification Status
const updateUserVerificationStatus = async (verificationToken) => {
  return await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null },
    { new: true }
  );
};

// update Subscription
const updateUserSubscription = async (id, subscription) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
};

module.exports = {
  registerUser,
  findUserByMail,
  getUserById,
  updateUserSubscription,
  updateUserVerificationStatus,
};
