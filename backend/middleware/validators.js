const validator = require('validator');
const {Joi , celebrate} = require('celebrate')

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

module.exports.updateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().optional().min(2).max(30),
  }),
});

module.exports.updateAvatar = celebrate({
  body: Joi.object({
    avatar: Joi.string().optional().custom(validateURL)
  })
})

module.exports.addCard = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validateURL)
  })
})

module.exports.signUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().optional().min(2).max(30),
    about: Joi.string().optional().min(2).max(30),
    avatar: Joi.string().optional().custom(validateURL),
  }),
})

module.exports.signIn = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
})