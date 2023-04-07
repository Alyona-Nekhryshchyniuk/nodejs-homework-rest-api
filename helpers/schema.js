const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(15).required().messages({
    "string.alphanum": `"name" must only contain alpha-numeric characters`,
    "any.required": `Missing required "name" field`,
    "string.empty": `"name" cannot be an empty field`,
    "string.min": `"name" should have a minimum length of "3"`,
    "string.max": `"name" length must be less than or equal to "15" characters long`,
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "any.required": `Missing required "email" field`,
      "string.empty": `"email" cannot be an empty field`,
      "string.email": `"email" must be a valid email`,
    }),
  phone: Joi.string().min(4).max(10).required().messages({
    "any.required": `Missing required "phone" field`,
    "string.empty": `"phone" cannot be an empty field`,
    "string.min": `"phone" should have a minimum length of "4"`,
    "string.max": `"name" length must be less than or equal to "10" characters long`,
  }),
});

module.exports = schema;
