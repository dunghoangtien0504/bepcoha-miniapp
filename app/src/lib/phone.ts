// Chuẩn hoá SĐT di động Việt Nam về dạng 0xxxxxxxxx (10 số), giống normalizePhone của Haco-OS.
// Server vẫn kiểm lại; ở đây chỉ để báo lỗi sớm cho khách.

export function normalizeVnPhone(raw: string): string | null {
  let s = raw.replace(/[\s.\-()]/g, '')
  if (s.startsWith('+84')) s = '0' + s.slice(3)
  else if (s.startsWith('84') && s.length === 11) s = '0' + s.slice(2)
  return /^0(3|5|7|8|9)\d{8}$/.test(s) ? s : null
}

export function maskPhone(phone: string): string {
  return phone.length < 4 ? phone : phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2)
}
