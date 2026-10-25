// Nén ảnh ngay trên máy khách trước khi gửi (≤ 1280px cạnh dài, JPEG, ≤ 700KB) — tiết kiệm 4G của khách và dung lượng máy chủ.
export const MAX_SIDE = 1280
export const MAX_BYTES = 700 * 1024

/** Kích thước mới giữ tỉ lệ, cạnh dài không quá `max`. */
export function fitSize(w: number, h: number, max = MAX_SIDE): { w: number; h: number } {
  if (w <= max && h <= max) return { w, h }
  const k = max / Math.max(w, h)
  return { w: Math.round(w * k), h: Math.round(h * k) }
}

/** Số byte thật của data URL base64. */
export const dataUrlBytes = (d: string) => Math.floor(((d.length - d.indexOf(',') - 1) * 3) / 4)

export async function compressImage(file: File): Promise<string> {
  if (!/^image\//.test(file.type)) throw new Error('not_image')
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((ok, bad) => {
      const i = new Image()
      i.onload = () => ok(i)
      i.onerror = () => bad(new Error('decode'))
      i.src = url
    })
    const { w, h } = fitSize(img.naturalWidth, img.naturalHeight)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas')
    ctx.drawImage(img, 0, 0, w, h)
    for (const q of [0.82, 0.72, 0.6, 0.5]) {
      const d = canvas.toDataURL('image/jpeg', q)
      if (dataUrlBytes(d) <= MAX_BYTES) return d
    }
    throw new Error('too_large')
  } finally {
    URL.revokeObjectURL(url)
  }
}
