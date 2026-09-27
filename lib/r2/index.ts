import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.R2_BUCKET_NAME ?? "placeholder-bucket";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID ?? "placeholder"}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "placeholder",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "placeholder",
  },
});

export async function createPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  return getSignedUrl(r2Client, command, { expiresIn: 15 * 60 });
}

export async function getObjectBuffer(key: string) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const response = await r2Client.send(command);
  const bytes = await response.Body?.transformToByteArray();
  if (!bytes) throw new Error("Empty object body.");
  return Buffer.from(bytes);
}

export async function putObjectBuffer(key: string, body: Buffer, contentType: string) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType });
  await r2Client.send(command);
}

export function publicUrlFor(key: string) {
  const base = process.env.R2_PUBLIC_DOMAIN;
  return base ? `${base}/${key}` : key;
}
