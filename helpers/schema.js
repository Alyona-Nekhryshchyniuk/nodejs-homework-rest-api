const Joi = require("joi");
const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// CONTACTS MONGOOSE SCHEMA

const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model("contact", contactsSchema);

// USER MONGOOSE SCHEMA

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

// document middleware with password hashing
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = model("user", userSchema);

// JOI SCHEMA

const contactsJOISchema = Joi.object(
  {
    name: Joi.string().min(3).max(15).required().messages({
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
    phone: Joi.string().min(4).max(15).required().messages({
      "any.required": `Missing required "phone" field`,
      "string.empty": `"phone" cannot be an empty field`,
      "string.min": `"phone" should have a minimum length of "4"`,
      "string.max": `"phone" length must be less than or equal to "15" characters long`,
    }),
  },
  { versionKey: false }
);

const favoriteFieldSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `Missing field "favorite"`,
  }),
});

const subscriptionFieldSchema = Joi.object({
  subscription: Joi.string()
    .required()
    .regex(/^(starter|pro|business)$/)
    .messages({
      "any.required": `Missing field "subscription"`,
    }),
});

const userJOISchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "any.required": `Missing required "email" field`,
      "string.empty": `"email" cannot be an empty field`,
      "string.email": `"email" must be a valid email`,
    }),
  password: Joi.string().alphanum().min(4).max(15).required().messages({
    "any.required": `Missing required "password" field`,
    "string.empty": `"password" cannot be an empty field`,
    "string.min": `"password" should have a minimum length of "4"`,
    "string.max": `"password" length must be less than or equal to "15" characters long`,
  }),
});

module.exports = {
  contactsJOISchema,
  userJOISchema,
  favoriteFieldSchema,
  subscriptionFieldSchema,
  Contact,
  User,
};
