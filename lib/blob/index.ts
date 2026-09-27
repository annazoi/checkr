import { del, put } from "@vercel/blob";

export async function putBlob(pathname: string, body: Buffer, contentType: string) {
  return put(pathname, body, { access: "public", contentType, addRandomSuffix: true });
}

export async function deleteBlob(url: string) {
  await del(url).catch((error) => console.error("Failed to delete blob", url, error));
}

export async function fetchBlobBuffer(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch blob: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
