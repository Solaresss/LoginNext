import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Almacenamiento en un archivo JSON (data/users.json).
 */
export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  createdAt: string;
};

const DB_FILE = path.join(process.cwd(), "data", "users.json");

async function readUsers(): Promise<User[]> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(users, null, 2));
}

export async function findUserById(id: string) {
  return (await readUsers()).find((u) => u.id === id);
}

/** Busca por nombre de usuario o por correo (sin distinguir mayúsculas). */
export async function findUserByLogin(login: string) {
  const value = login.trim().toLowerCase();
  return (await readUsers()).find(
    (u) => u.username.toLowerCase() === value || u.email.toLowerCase() === value
  );
}

export async function createUser(data: Pick<User, "username" | "email" | "passwordHash">) {
  const users = await readUsers();
  const user: User = {
    id: crypto.randomUUID(),
    username: data.username.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash: data.passwordHash,
    verified: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return user;
}

export async function updateUser(id: string, changes: Partial<Omit<User, "id">>) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  users[index] = { ...users[index], ...changes };
  await writeUsers(users);
  return users[index];
}
