import { compare, hash } from "bcryptjs";

const SALT_ROUND = parseInt(process.env.NEXTAUTH_SECRET_SALT_ROUND || "10");

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, SALT_ROUND);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash);
}