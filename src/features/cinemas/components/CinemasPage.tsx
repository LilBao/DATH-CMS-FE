"use client";

import React, { useState } from "react";
import CinemaList from "./CinemaList";
import CinemaDetails from "./CinemaDetails";
import { BranchResponse } from "@/src/types/cinema.type";

export default function CinemasPage() {
  const [selectedCinema, setSelectedCinema] = useState<BranchResponse | null>(null);


  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic">
            HỆ THỐNG <span className="text-gradient">RẠP PHIM</span>
          </h1>
          <p className="text-on-surface/60 max-w-2xl font-medium">
            Khám phá hệ thống rạp chiếu phim hiện đại với công trình kiến trúc độc đáo, 
            trang thiết bị tân tiến và dịch vụ đẳng cấp thượng lưu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar - List */}
          <div className="lg:col-span-4">
            <CinemaList onSelect={setSelectedCinema} />
          </div>

          {/* Content - Details */}
          <div className="lg:col-span-8">
            <CinemaDetails cinema={selectedCinema} />
          </div>
        </div>
      </div>
    </div>
  );
}
