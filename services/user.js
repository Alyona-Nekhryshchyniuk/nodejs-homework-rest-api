const fs = require("fs/promises");
const { User } = require("../helpers/schema");
const gravatar = require("gravatar");

// register
const registerUser = async ({ email, password }) => {
  const avatarURL = gravatar.url(email);
  console.log(avatarURL);

  const emailAlreadyInDB = await User.findOne({ email });
  if (emailAlreadyInDB) return;

  const user = await User.create({ email, password, avatarURL });
  return user;
};

// login
const loginUser = async (email) => {
  return await User.findOne({ email });
};

// getUserById
const getUserById = async (_id) => {
  return await User.findById({ _id });
};

// updateUserSubscription
const updateUserSubscription = async (id, subscription) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { subscription },
    { new: true }
  );
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserSubscription,
};
