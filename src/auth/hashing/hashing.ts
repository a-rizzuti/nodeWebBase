import crypto from 'crypto';

export default function hashHmacSha256(s : string) {
  return crypto
    .createHmac('sha256', `${process.env.JWT_SECRET_KEY}`)
    .update(s)
    .digest('hex');
}