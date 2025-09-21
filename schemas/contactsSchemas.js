import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(3).required(),
  favorite: Joi.boolean().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(1),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim().min(3),
  favorite: Joi.boolean(),
}).min(1);

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});