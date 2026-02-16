import { randomBytes } from "crypto";

// ─── Code Generation ─────────────────────────────────────────
const ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generate a random short code using Node crypto.
 * Default length: 6 characters → 62^6 ≈ 56 billion combinations.
 */
export function generateCode(length = 6): string {
    const bytes = randomBytes(length);
    let code = "";
    for (let i = 0; i < length; i++) {
        code += ALPHABET[bytes[i] % ALPHABET.length];
    }
    return code;
}

// ─── Validation ──────────────────────────────────────────────

/**
 * Validate that a string is a well-formed http(s) URL.
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Validate custom alias format: a-zA-Z0-9_- , 3–32 chars.
 */
const ALIAS_REGEX = /^[a-zA-Z0-9_-]{3,32}$/;

export function isValidAlias(alias: string): boolean {
    return ALIAS_REGEX.test(alias);
}
