import React from "react";

export default function PremiumPromoSection() {
  return (
    <section className="px-12 py-20 bg-surface-container-low">
      {/* GRID CHÍNH: Chia 3 cột, độ cao mỗi dòng là 250px */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {/* KHỐI BÊN TRÁI (Director's Club): Bắt buộc phải có md:col-span-2 và md:row-span-2 */}
        <div className="md:col-span-2 md:row-span-2 glass-card rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group cursor-pointer">
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
            alt="VIP Cinema"
            src="https://i.ibb.co/3pQG6qX/vip-cinema.jpg"
          />
          <div className="relative z-10 space-y-4">
            <h3 className="text-5xl font-headline font-black text-primary tracking-tighter italic">
              DIRECTOR'S CLUB
            </h3>
            <p className="text-on-surface-variant max-w-md text-lg">
              Trải nghiệm xem phim đẳng cấp 5 sao với ghế da chỉnh điện, phục vụ
              tại chỗ và âm thanh Dolby Atmos tuyệt đỉnh.
            </p>
            <button className="w-fit text-primary font-bold border-b-2 border-primary py-2 hover:opacity-80 transition-all uppercase text-sm tracking-wider">
              Khám phá đặc quyền
            </button>
          </div>
        </div>

        {/* KHỐI BÊN PHẢI SỐ 1 (Member Rewards) */}
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-primary/20 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-primary text-4xl">
            loyalty
          </span>
          <div>
            <h4 className="text-xl font-headline font-bold mb-2 text-white">
              Member Rewards
            </h4>
            <p className="text-sm text-on-surface-variant">
              Tích điểm đổi quà, ưu đãi 50% bắp nước mỗi thứ Tư hàng tuần.
            </p>
          </div>
        </div>

        {/* KHỐI BÊN PHẢI SỐ 2 (Quick Booking) */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-secondary/20 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-secondary text-4xl">
            confirmation_number
          </span>
          <div>
            <h4 className="text-xl font-headline font-bold mb-2 text-white">
              Quick Booking
            </h4>
            <p className="text-sm text-on-surface-variant">
              Đặt vé nhanh chóng chỉ với 3 bước chạm trên ứng dụng di động.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
