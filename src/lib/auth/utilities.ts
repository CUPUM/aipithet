import { Argon2id } from 'oslo/password';

/**
 * Normalize how passwords are hashed across the app.
 */
export async function hashPassword(raw: string) {
	return new Argon2id().hash(raw);
}

/**
 * Normalize how paswsword hashes are verified across the app.
 */
export async function verifyPassword(hash: string, password: string) {
	return new Argon2id().verify(hash, password);
}
