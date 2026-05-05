import React from "react";

export default function PremiumPromoSection() {
  return (
    <section className="px-12 py-20 bg-surface-container-low">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Khối to bên trái chiếm 2 cột */}
        <div className="md:col-span-2 glass-card rounded-3xl p-10 flex flex-col justify-end relative overflow-hidden group min-h-[520px]">
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000"
            alt="VIP Cinema"
            src="https://www.shutterstock.com/image-photo/empty-cinema-auditorium-rows-red-600nw-2713917599.jpg"
          />
          <div className="relative z-10 space-y-4">
            <h3 className="text-5xl font-headline font-black text-primary tracking-tighter italic uppercase">
              CINEMA CMS
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

        {/* Cột bên phải chứa 2 khối nhỏ */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-primary/10 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary text-4xl">
              loyalty
            </span>
            <div>
              <h4 className="text-xl font-headline font-bold mb-2 text-white">
                Member Rewards
              </h4>
              <p className="text-sm text-on-surface-variant">
                Tích điểm đổi quà, ưu đãi 50% bắp nước mỗi thứ Tư.
              </p>
            </div>
          </div>

          <div className="flex-1 bg-secondary/10 border border-secondary/20 rounded-3xl p-8 flex flex-col justify-between hover:bg-secondary/20 transition-colors">
            <span className="material-symbols-outlined text-secondary text-4xl">
              confirmation_number
            </span>
            <div>
              <h4 className="text-xl font-headline font-bold mb-2 text-white">
                Quick Booking
              </h4>
              <p className="text-sm text-on-surface-variant">
                Đặt vé nhanh chóng chỉ với 3 bước chạm trên ứng dụng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
