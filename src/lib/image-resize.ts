/**
 * Client-side image resizer. Produces multiple JPEG variants for responsive srcset.
 * Widths (px): 320 (thumb), 640, 1200, 2000.
 */
export const COVER_WIDTHS = [320, 640, 1200, 2000] as const;
export type CoverWidth = (typeof COVER_WIDTHS)[number];

export type ResizedVariant = { width: CoverWidth; blob: Blob };

export async function resizeCoverImage(file: File): Promise<ResizedVariant[]> {
  const bitmap = await loadBitmap(file);
  const results: ResizedVariant[] = [];
  for (const targetWidth of COVER_WIDTHS) {
    const w = Math.min(targetWidth, bitmap.width);
    const h = Math.round((bitmap.height / bitmap.width) * w);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not supported");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Encode failed"))),
        "image/jpeg",
        targetWidth <= 640 ? 0.8 : 0.85,
      ),
    );
    results.push({ width: targetWidth, blob });
  }
  bitmap.close?.();
  return results;
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  if ("createImageBitmap" in window) {
    return await createImageBitmap(file);
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    // @ts-expect-error – fallback for older browsers
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function buildSrcSet(srcset: Record<string, string> | null | undefined): string | undefined {
  if (!srcset) return undefined;
  return Object.entries(srcset)
    .map(([w, url]) => `${url} ${w}w`)
    .join(", ");
}
