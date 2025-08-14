import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "db", "contacts.json");

/* ------ helpers ------ */
async function readContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
}
/* ---------------------- */

export async function listContacts() {
  return await readContacts();
}

export async function getContactById(contactId) {
  const contacts = await readContacts();
  return contacts.find((c) => c.id === String(contactId)) ?? null;
}

export async function removeContact(contactId) {
  const contacts = await readContacts();
  const idx = contacts.findIndex((c) => c.id === String(contactId));
  if (idx === -1) return null;
  const [removed] = contacts.splice(idx, 1);
  await writeContacts(contacts);
  return removed;
}

export async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = {
    id: nanoid(),
    name, email, phone,
  };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}