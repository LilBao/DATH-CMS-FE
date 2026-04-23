import React from "react";

export default function Footer() {
  return (
    <footer className="w-full pt-20 pb-10 bg-[#131313] border-t border-[#e5e2e1]/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="text-lg font-bold text-[#f5c948]">
            CINEMA DIRECTOR’S CUT
          </div>
          <p className="font-body text-xs text-[#e5e2e1]/60 leading-relaxed">
            Hệ thống rạp chiếu phim tiêu chuẩn quốc tế, mang lại trải nghiệm
            điện ảnh chân thực và sống động nhất cho khán giả Việt Nam.
          </p>
          <div className="flex space-x-4">
            <a
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">
                public
              </span>
            </a>
            <a
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
            </a>
          </div>
        </div>

        <div className="space-x-0 space-y-4">
          <h4 className="text-[#f5c948] font-bold text-sm tracking-widest uppercase mb-6">
            Chính sách
          </h4>
          <ul className="space-y-3">
            <li>
              <a
                className="font-body text-xs text-[#e5e2e1]/40 hover:text-[#f5c948] transition-colors"
                href="#"
              >
                Điều khoản chung
              </a>
            </li>
            <li>
              <a
                className="font-body text-xs text-[#e5e2e1]/40 hover:text-[#f5c948] transition-colors"
                href="#"
              >
                Chính sách thanh toán
              </a>
            </li>
            <li>
              <a
                className="font-body text-xs text-[#e5e2e1]/40 hover:text-[#f5c948] transition-colors"
                href="#"
              >
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a
                className="font-body text-xs text-[#e5e2e1]/40 hover:text-[#f5c948] transition-colors"
                href="#"
              >
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
        </div>

        <div className="space-x-0 space-y-4">
          <h4 className="text-[#f5c948] font-bold text-sm tracking-widest uppercase mb-6">
            Chăm sóc khách hàng
          </h4>
          <div className="space-y-3">
            <p className="font-body text-xs text-[#e5e2e1]/40">
              Hotline: <span className="text-[#f5c948]">1900 1234</span>
            </p>
            <p className="font-body text-xs text-[#e5e2e1]/40">
              Giờ làm việc: 8:00 - 22:00
            </p>
            <p className="font-body text-xs text-[#e5e2e1]/40">
              Email: support@directorscut.vn
            </p>
          </div>
        </div>

        <div className="space-x-0 space-y-4">
          <h4 className="text-[#f5c948] font-bold text-sm tracking-widest uppercase mb-6">
            Kết nối
          </h4>
          <div className="flex flex-col space-y-4">
            <div className="pt-4">
              <p className="text-[10px] text-[#e5e2e1]/30">
                © 2024 Cinema Director’s Cut. All Rights Reserved. High-End
                Editorial Experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
