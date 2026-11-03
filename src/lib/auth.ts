/**
 * Client-side password hashing for the MVP.
 * This is NOT a substitute for server-side auth — it only avoids keeping
 * plaintext passwords in localStorage while there is no backend.
 */
const SALT = 'mbc-mvp-salt::'

export async function hashPassword(password: string): Promise<string> {
  const input = `${SALT}${password}`
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  let h = 0
  for (const c of input) h = (h * 31 + c.charCodeAt(0)) | 0
  return `fb_${(h >>> 0).toString(16)}`
}

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'] as const
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] }
}
