// Lớp platform: mọi chỗ khác nhau giữa bản web và Zalo Mini App nằm sau giao diện này.

export type IdentifyMethod =
  | { kind: 'phone_form' } // web: khách tự nhập SĐT (chưa xác minh)
  | { kind: 'zalo'; phoneToken: string; accessToken: string } // Zalo: SĐT đã xác minh qua getPhoneNumber

export interface Platform {
  mode: 'web' | 'zalo'
  /** Tham số khi mở app: mã lô QR (b), mã giới thiệu (ref)… */
  launchParams(): Record<string, string>
  /** Lấy định danh. Zalo ném lỗi 'denied' nếu khách từ chối chia sẻ SĐT. */
  identify(): Promise<IdentifyMethod>
  /** Có thể quan tâm OA ngay trong app không (Zalo) hay phải mở link (web). */
  canFollowInApp: boolean
  followOA(oaId: string): Promise<'followed' | 'opened' | 'denied'>
  openChat(target: { kind: 'zalo_oa'; oaId: string } | { kind: 'url'; url: string }, message?: string): Promise<void>
  share(p: { title: string; text: string; url: string }): Promise<'shared' | 'copied' | 'cancelled'>
  /** Chia sẻ một đoạn chữ, không kèm link (lời báo quà). Zalo: openShareSheet type text; web: Web Share hoặc chép. */
  shareText(text: string): Promise<'shared' | 'copied' | 'cancelled'>
  /** Khoe ảnh lên Nhật ký Zalo (Zalo: openPostFeed kiểu image, cần link ảnh https công khai). Web: chia sẻ chữ. */
  postFeed(imageUrl: string, text: string): Promise<'shared' | 'copied' | 'cancelled'>
  openExternal(url: string): Promise<void>
  /** Giữ màn hình sáng khi đang nấu (chế độ nấu). Zalo: keepScreen; web: Wake Lock API nếu trình duyệt hỗ trợ. */
  keepAwake(on: boolean): Promise<void>
  /** Rung báo hết giờ hẹn (nấu). Máy không hỗ trợ thì bỏ qua. */
  vibrate(ms: number): void
  /** Đã chạy như app trên màn hình chính chưa (web: chế độ standalone; Zalo: không biết → false). */
  isOnHomeScreen(): boolean
  /**
   * Thêm app ra màn hình chính. Zalo: createShortcut. Web: Android Chrome hiện hộp cài đặt (beforeinstallprompt);
   * iPhone và trình duyệt khác chỉ có thể hướng dẫn khách tự làm.
   */
  addToHome(): Promise<'added' | 'dismissed' | 'guide_ios' | 'guide_other'>
  /** Token phiên: web dùng cookie httpOnly nên luôn null. */
  getToken(): string | null
  setToken(token: string | null): Promise<void>
  init(): Promise<void>
}
