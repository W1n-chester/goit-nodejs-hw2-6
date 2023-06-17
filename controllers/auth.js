const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const crypto = require('crypto');

const { User } = require('../models/user');

const { HttpError, ctrlWrapper, sendEmail } = require('../helpers');
const PROJECT_URL = 'http://localhost:3000';
const SECRET_KEY = 'Stalker';
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email already in use');
  }
 const verificationCode = crypto.randomUUID();
  const hashPassword = await bcrypt.hash(password, 10);
  const gravatarURL = gravatar.url(email);

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL: gravatarURL, verificationCode });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    throw HttpError(404);
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: '' });

  res.json({
    message: 'Verify success',
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw HttpError(400, 'Email already verify');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verify email send',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.json({
    message: 'Logout success',
  });
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join('avatars', filename);
  const image = await Jimp.read(`./public/${avatarURL}`);
    if (!image) {
    throw HttpError(400);
  }
  image.resize(250, 250).write(`./public/${avatarURL}`);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

module.exports = {
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  verify: ctrlWrapper(verify),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
