import Contact from "../models/contact.js";

export async function listContacts(
  ownerId,
  { page = 1, limit = 20, favorite } = {}
) {
  const where = { owner: ownerId };
  if (typeof favorite !== "undefined") {
    where.favorite = favorite === true || favorite === "true";
  }

  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));

  const offset = (p - 1) * l;

  return Contact.findAll({
    where,
    limit: l,
    offset,
    order: [["id", "ASC"]],
  });
}

export async function getContactById(ownerId, id) {
  return Contact.findOne({ where: { id: Number(id), owner: ownerId } });
}

export async function addContact(ownerId, name, email, phone, favorite = false) {
  return Contact.create({ name, email, phone, favorite, owner: ownerId });
}

export async function updateContact(ownerId, id, data) {
  const [count, rows] = await Contact.update(data, {
    where: { id: Number(id), owner: ownerId },
    returning: true,
  });
  return count ? rows[0] : null;
}

export async function removeContact(ownerId, id) {
  const row = await Contact.findOne({ where: { id: Number(id), owner: ownerId } });
  if (!row) return null;
  await row.destroy();
  return row;
}

export async function updateStatusContact(ownerId, id, data) {
  return updateContact(ownerId, id, data);
}

export default {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};