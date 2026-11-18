const MAX_IMAGE_BYTES = 1024 * 1024;

export async function readProjectImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Project images must be 1 MB or smaller.");

  const bytes = Buffer.from(await file.arrayBuffer());
  const isPng = bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  const isJpeg = bytes.subarray(0, 3).equals(Buffer.from("ffd8ff", "hex"));
  const isWebp = bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  const contentType = isPng ? "image/png" : isJpeg ? "image/jpeg" : isWebp ? "image/webp" : null;
  if (!contentType) throw new Error("Choose a PNG, JPEG, or WebP image.");
  return { bytes, contentType };
}
