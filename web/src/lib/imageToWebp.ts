// Convert an image File to an optimized WebP Blob entirely in the browser
// (canvas encode), downscaling very large photos. Keeps the site fast by
// ensuring everything uploaded is WebP. Falls back to the original file if the
// browser can't encode WebP or anything goes wrong.
export async function fileToWebp(
  file: File,
  opts?: { maxDim?: number; quality?: number }
): Promise<Blob> {
  const maxDim = opts?.maxDim ?? 1600;
  const quality = opts?.quality ?? 0.82;

  if (typeof window === "undefined" || !file.type?.startsWith("image/")) return file;
  // Already a reasonably small webp? leave it.
  if (file.type === "image/webp" && file.size < 400 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    const longest = Math.max(width, height);
    if (longest > maxDim) {
      const scale = maxDim / longest;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    // toBlob can return null, or a non-webp if unsupported — guard both.
    if (blob && blob.type === "image/webp" && blob.size > 0) return blob;
    return file;
  } catch {
    return file;
  }
}
