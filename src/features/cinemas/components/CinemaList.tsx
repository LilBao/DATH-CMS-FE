"use client";

import React, { useEffect, useState } from "react";
import { cinemaService } from "@/src/services/cinema.service";
import { BranchResponse, ScreenRoomResponse } from "@/src/types/cinema.type";

const CITIES = ["Tất cả", "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng"];

export default function CinemaList({ onSelect }: { onSelect: (cinema: BranchResponse) => void }) {
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await cinemaService.getAllBranches();
        if (response.success) {
          setBranches(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const filteredCinemas = branches.filter((c) => {
    if (selectedCity === "Tất cả") return true;
    const searchCity = selectedCity === "TP. Hồ Chí Minh" ? "Hồ Chí Minh" : selectedCity;
    return c.bAddress.toLowerCase().includes(searchCity.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-surface-container rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* City Filter */}
      <div className="flex flex-wrap gap-2">
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              selectedCity === city
                ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                : "bg-surface-container-high text-on-surface/60 hover:text-white"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredCinemas.map((cinema) => (
          <div
            key={cinema.branchId}
            onClick={() => {
              setActiveId(cinema.branchId);
              onSelect(cinema);
            }}
            className={`p-4 rounded-2xl cursor-pointer transition-all border hover-lift ${
              activeId === cinema.branchId
                ? "bg-primary/10 border-primary"
                : "bg-surface-container border-white/5 hover:border-white/20"
            }`}
          >
            <h3 className="font-bold text-white mb-1">{cinema.bName}</h3>
            <p className="text-xs text-on-surface/60 line-clamp-2">
              {cinema.bAddress}
            </p>
          </div>
        ))}
        {filteredCinemas.length === 0 && (
          <div className="text-center py-12 text-on-surface/40 italic">
            Không tìm thấy rạp nào ở khu vực này.
          </div>
        )}
      </div>
    </div>
  );
}

