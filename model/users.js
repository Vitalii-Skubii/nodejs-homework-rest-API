const User = require("./schemas/user");

const findById = async (userId) => {
  return await User.findOne({ _id: userId });
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (userId, token) => {
  return await User.updateOne({ _id: userId }, { token });
};

const updateAvatar = async (userId, avatar) => {
  return await User.updateOne({ _id: userId }, { avatar });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar
};
