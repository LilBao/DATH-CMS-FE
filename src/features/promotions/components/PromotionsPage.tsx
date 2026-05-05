"use client";

import React, { useState } from "react";
import PromotionCard from "./PromotionCard";

const MOCK_PROMOS = [
  {
    id: "1",
    title: "Thứ Hai Siêu Vui",
    description: "Đồng giá vé 45k cho tất cả các suất chiếu vào ngày Thứ Hai hàng tuần. Áp dụng cho mọi lứa tuổi.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    expiry: "31/12/2026",
    category: "Giá vé",
  },
  {
    id: "2",
    title: "Combo Couple Ưu Đãi",
    description: "Tiết kiệm đến 30% khi mua Combo 2 Bắp + 2 Nước. Tặng kèm 1 phần quà bất ngờ từ bộ phim đang hot.",
    image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2076&auto=format&fit=crop",
    expiry: "15/06/2026",
    category: "Ẩm thực",
  },
  {
    id: "3",
    title: "Thành Viên Mới - Quà Tới Tấp",
    description: "Đăng ký thành viên CMS ngay hôm nay để nhận ngay voucher giảm 50% cho vé đầu tiên và tích lũy điểm thưởng x2.",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    expiry: "Vĩnh viễn",
    category: "Thành viên",
  },
  {
    id: "4",
    title: "Ngày Hội Gia Đình",
    description: "Mua 3 vé tặng 1 vé miễn phí cho trẻ em dưới 12 tuổi vào mỗi Chủ Nhật. Miễn phí bắp ngọt cho các bé.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    expiry: "30/09/2026",
    category: "Gia đình",
  },
  {
    id: "5",
    title: "Học Sinh - Sinh Viên",
    description: "Xuất trình thẻ HSSV để được hưởng mức giá ưu đãi chỉ từ 50k cho các suất chiếu trước 17h hàng ngày.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
    expiry: "31/12/2026",
    category: "HSSV",
  },
  {
    id: "6",
    title: "Siêu Phẩm Bom Tấn",
    description: "Đặt vé sớm các phim bom tấn để nhận ngay poster độc quyền và bộ sticker giới hạn.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop",
    expiry: "Theo phim",
    category: "Sự kiện",
  },
];

const CATEGORIES = ["Tất cả", "Giá vé", "Ẩm thực", "Thành viên", "Gia đình", "HSSV", "Sự kiện"];

export default function PromotionsPage() {
  const [selectedCat, setSelectedCat] = useState("Tất cả");

  const filteredPromos = MOCK_PROMOS.filter(
    (p) => selectedCat === "Tất cả" || p.category === selectedCat
  );

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-white tracking-tighter italic">
              ƯU ĐÃI <span className="text-gradient">ĐẶC QUYỀN</span>
            </h1>
            <p className="text-on-surface/60 max-w-xl font-medium leading-relaxed">
              Tận hưởng những chương trình khuyến mãi hấp dẫn nhất chỉ có tại CMS Cinema. 
              Từ ưu đãi giá vé đến quà tặng ẩm thực, chúng tôi luôn có điều bất ngờ dành cho bạn.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  selectedCat === cat
                    ? "bg-primary text-on-primary shadow-xl shadow-primary/30 scale-105"
                    : "bg-surface-container-high text-on-surface/40 hover:text-white hover:bg-surface-container-highest"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPromos.map((promo) => (
            <div key={promo.id} className="hover-lift">
              <PromotionCard promo={promo} />
            </div>
          ))}
        </div>
        
        {/* Newsletter Section */}
        <div className="mt-24 bg-surface-container rounded-[40px] p-12 text-center relative overflow-hidden border border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="material-symbols-outlined text-5xl text-primary animate-bounce">mail</span>
                <h2 className="text-3xl font-black text-white tracking-tight">Đừng bỏ lỡ bất kỳ ưu đãi nào!</h2>
                <p className="text-on-surface/60 font-medium">Đăng ký nhận tin để cập nhật sớm nhất các chương trình khuyến mãi và lịch chiếu phim bom tấn.</p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <input 
                        type="email" 
                        placeholder="Địa chỉ email của bạn" 
                        className="flex-1 bg-background border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                    <button className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                        Đăng ký ngay
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
