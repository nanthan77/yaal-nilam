const WEBP_MIME_TYPE = "image/webp";

type WebpOptions = {
  maxDim?: number;
  quality?: number;
  maxBytes?: number;
};

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
};

function loadHtmlImage(file: File): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.decoding = "async";
    image.onload = () =>
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        cleanup: () => URL.revokeObjectURL(objectUrl),
      });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image format could not be decoded."));
    };
    image.src = objectUrl;
  });
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Safari and some mobile formats work through HTMLImageElement even when
      // createImageBitmap cannot decode them.
    }
  }

  return loadHtmlImage(file);
}

function encodeCanvas(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || blob.type !== WEBP_MIME_TYPE || blob.size === 0) {
        reject(new Error("This browser could not create a WebP image."));
        return;
      }
      resolve(blob);
    }, WEBP_MIME_TYPE, quality);
  });
}

/**
 * Converts every selected image to a bounded WebP blob before upload.
 * Conversion failures are explicit so a JPEG/PNG is never uploaded with a
 * misleading .webp extension or content type.
 */
export async function fileToWebp(file: File, opts: WebpOptions = {}): Promise<Blob> {
  if (typeof window === "undefined") {
    throw new Error("Image conversion is only available in the browser.");
  }
  if (!file.type?.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  const maxDim = Math.max(640, opts.maxDim ?? 1440);
  const initialQuality = Math.min(0.9, Math.max(0.55, opts.quality ?? 0.78));
  const maxBytes = Math.max(200 * 1024, opts.maxBytes ?? 700 * 1024);
  const decoded = await decodeImage(file);

  try {
    if (!decoded.width || !decoded.height) {
      throw new Error("The image has invalid dimensions.");
    }

    const longestSide = Math.max(decoded.width, decoded.height);
    const initialScale = Math.min(1, maxDim / longestSide);
    let width = Math.max(1, Math.round(decoded.width * initialScale));
    let height = Math.max(1, Math.round(decoded.height * initialScale));
    let smallest: Blob | null = null;

    // Try a few quality/size combinations. This keeps normal photos sharp while
    // preventing unusually detailed images from becoming multi-megabyte files.
    // The final smallest WebP is still returned as a safe fallback so every
    // accepted image is converted instead of silently falling back to JPEG/PNG.
    for (let sizeAttempt = 0; sizeAttempt < 5; sizeAttempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image conversion is unavailable in this browser.");

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(decoded.source, 0, 0, width, height);

      for (const quality of [initialQuality, initialQuality - 0.1, initialQuality - 0.2]) {
        const blob = await encodeCanvas(canvas, Math.max(0.5, quality));
        if (!smallest || blob.size < smallest.size) smallest = blob;
        if (blob.size <= maxBytes) return blob;
      }

      width = Math.max(1, Math.round(width * 0.82));
      height = Math.max(1, Math.round(height * 0.82));
    }

    if (smallest) return smallest;
    throw new Error("The image could not be converted to WebP.");
  } finally {
    decoded.cleanup();
  }
}
