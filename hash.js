import crypto from 'node:crypto';

export function contentHash(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}
