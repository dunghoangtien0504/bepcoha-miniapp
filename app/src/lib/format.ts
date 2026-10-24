// Định dạng kiểu Việt Nam, theo giờ VN: 23/10, 23/10/2026, 20.000đ.

const parts = (iso: string) => {
  const p = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).formatToParts(new Date(iso))
  const get = (t: string) => p.find(x => x.type === t)?.value ?? ''
  return { d: get('day'), m: get('month'), y: get('year') }
}

export const dayMonth = (iso: string) => {
  const { d, m } = parts(iso)
  return `${d}/${m}`
}

export const fullDate = (iso: string) => {
  const { d, m, y } = parts(iso)
  return `${d}/${m}/${y}`
}

export const money = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ'
