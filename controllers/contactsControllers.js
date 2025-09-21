import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { page, limit, favorite } = req.query;
    const contacts = await contactsService.listContacts(req.user.id, { page, limit, favorite });
    res.status(200).json(contacts);
  } catch (err) { next(err); }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.user.id, req.params.id);
    if (!contact) return next(HttpError(404, "Not found"));
    res.status(200).json(contact);
  } catch (err) { next(err); }
};

export const deleteContact = async (req, res, next) => {
  try {
    const removed = await contactsService.removeContact(req.user.id, req.params.id);
    if (!removed) return next(HttpError(404, "Not found"));
    res.status(200).json(removed);
  } catch (err) { next(err); }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const created = await contactsService.addContact(req.user.id, name, email, phone, favorite);
    res.status(201).json(created);
  } catch (err) { next(err); }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body || {}).length) return next(HttpError(400, "Body must have at least one field"));
    const updated = await contactsService.updateContact(req.user.id, req.params.id, req.body);
    if (!updated) return next(HttpError(404, "Not found"));
    res.status(200).json(updated);
  } catch (err) { next(err); }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const updated = await contactsService.updateStatusContact(req.user.id, req.params.id, { favorite: req.body.favorite });
    if (!updated) return next(HttpError(404, "Not found"));
    res.status(200).json(updated);
  } catch (err) { next(err); }
};