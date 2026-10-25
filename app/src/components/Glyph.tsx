// Bộ icon nét (24px, màu theo chữ) cho những chỗ zmp-ui không có icon: giỏ hàng, quà, ưu đãi, lửa chuỗi ngày.
const PATHS = {
  bag: 'M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2',
  book: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm0 13a3 3 0 0 1 3-3h9',
  ticket: 'M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7Zm10 0v10',
  calendar: 'M5 6h14v14H5V6Zm0 4h14M9 4v4m6-4v4',
  gift: 'M4 10h16v4H4v-4Zm2 4h12v6H6v-6Zm6-4v10M12 10c-2-4-6-4-6-1.5S10 10 12 10Zm0 0c2-4 6-4 6-1.5S14 10 12 10Z',
  fire: 'M12 21c-4 0-6-3-6-6 0-4 4-6 4-10 3 2 4 4 4 6 1-1 2-2 2-4 2 2 2 5 2 8 0 3-2 6-6 6Z',
  video: 'M4 7h11v10H4V7Zm11 3 5-3v10l-5-3',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  list: 'M8 7h11M8 12h11M8 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01',
  bookmark: 'M7 4h10v16l-5-4-5 4V4Z',
  group: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 9a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6m2 9a6 6 0 0 0-3-5',
} as const

export type GlyphName = keyof typeof PATHS

export function Glyph({ name, size = 24 }: { name: GlyphName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
