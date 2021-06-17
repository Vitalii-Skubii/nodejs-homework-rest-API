const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");
const UploadAvatar = require("../services/upload-avatars");
const EmailService = require("../services/email");
const {
  CreateSenderNodemailer,
  CreateSenderSendgrid,
} = require("../services/sender-email");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "User with this email al ready exist",
      });
    }
    const newUser = await Users.create(req.body);
    const { email, subscription, verifyToken, name } = newUser;
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid()
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
    } catch (err) {
      console.log(err.message);
    }
    return res.status(HttpCode.CREATED).json({
      status: "Created",
      code: HttpCode.CREATED,
      data: { user: { email, subscription } },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const checkPassword = await user?.validPassword(password);
    const verifyToken = await user?.verify;
    if (!user || !checkPassword || !verifyToken) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    if (!verifyToken) {
      return res.status(HttpCode.UNAUTORIZED).json({
        status: "error",
        code: HttpCode.UNAUTORIZED,
        message: "check email to confirm your account",
      });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "10h" });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  await Users.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await Users.findById(req.user.id);
    const { email, subscription } = currentUser;

    if (currentUser) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: { user: { email, subscription } },
      });
    }

    return res.status(HttpCode.UNAUTORIZED).json({
      status: "error",
      code: HttpCode.UNAUTORIZED,
      message: "Not authorized",
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar(AVATAR_OF_USERS);

    const avatar = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatar,
    });

    await Users.updateAvatar(id, avatar);

    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatar },
    });
  } catch (err) {
    next(err.message);
  }
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await Users.findByVerifyToken(verificationToken);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);

      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification successful",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (err) {
    next(err.message);
  }
};

const repeatVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  if (email) {
    const user = await Users.findByEmail(email);
    if (user) {
      const { email, verifyToken, verify } = user;

      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderNodemailer()
      );

      await emailService.sendVerifyPasswordEmail(verifyToken, email);
      if (!verify) {
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          message: "Verification email sent",
        });
      }

      return res.status(HttpCode.BAD_REQUEST).json({
        status: "bad request",
        code: HttpCode.BAD_REQUEST,
        message: "Verification has already been passed",
      });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: "not found",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  }
  return res.status(HttpCode.BAD_REQUEST).json({
    status: "Bad Request",
    code: HttpCode.BAD_REQUEST,
    message: "missing required field email",
  });
};

module.exports = {
  reg,
  login,
  logout,
  getCurrentUser,
  avatars,
  verify,
  repeatVerifyEmail,
};
