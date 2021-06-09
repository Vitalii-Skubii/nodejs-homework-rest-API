const Joi = require("joi");

const { HttpCode } = require("../../../helpers/constants");

const schemaRegister = Joi.object({
  password: Joi.string()
    .min(4)
    .max(30)
    .regex(/[A-Z]\w+/)
    .required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required(),

  subscription: Joi.string(),
});

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required(),
  password: Joi.string().required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);

    next();
  } catch (err) {
    next({
      status: "400 Bad Request",
      code: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

module.exports.validateRegister = (req, _res, next) => {
  return validate(schemaRegister, req.body, next);
};

module.exports.validateLogin = (req, _res, next) => {
  return validate(schemaLogin, req.body, next);
};
