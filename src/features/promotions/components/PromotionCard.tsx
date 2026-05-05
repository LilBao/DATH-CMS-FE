"use client";

import React from "react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  expiry: string;
  category: string;
}

export default function PromotionCard({ promo }: { promo: Promotion }) {
  return (
    <div className="group relative bg-surface-container rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest rounded-full">
          {promo.category}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-on-surface/40 text-[10px] font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm text-primary">event</span>
          Hết hạn: {promo.expiry}
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
          {promo.title}
        </h3>
        <p className="text-sm text-on-surface/60 line-clamp-2 leading-relaxed">
          {promo.description}
        </p>
        
        <div className="pt-4">
          <button className="w-full py-3 bg-white/5 hover:bg-primary hover:text-on-primary rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border border-white/10 group-hover:border-transparent">
            Chi tiết ưu đãi
          </button>
        </div>
      </div>
    </div>
  );
}
