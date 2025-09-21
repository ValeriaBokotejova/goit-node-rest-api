import Contact from "../models/contact.js";

export async function listContacts() {
  return Contact.findAll();
}

export async function getContactById(id) {
  return Contact.findByPk(Number(id));
}

export async function addContact(name, email, phone, favorite = false) {
  return Contact.create({ name, email, phone, favorite });
}

export async function updateContact(id, data) {
  const [count, rows] = await Contact.update(data, {
    where: { id: Number(id) },
    returning: true,
  });
  return count ? rows[0] : null;
}

export async function removeContact(id) {
  const row = await Contact.findByPk(Number(id));
  if (!row) return null;
  await row.destroy();
  return row;
}

export async function updateStatusContact(id, data) {
  return updateContact(id, data);
}

export default {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};