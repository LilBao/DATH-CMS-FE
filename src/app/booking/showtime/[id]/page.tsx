"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SeatSelectionLayout } from "@/src/features/booking";

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Logic kiểm tra đăng nhập (Sẽ hoàn thiện ở bài SignIn/SignUp)
    // Tạm thời check xem localStorage có token không
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Nếu chưa đăng nhập -> Chuyển hướng về trang Đăng nhập
      // (Hoặc có thể truyền tham số ?redirect=/booking/showtime/xxx để quay lại sau khi login)
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Trong lúc đang kiểm tra Auth thì hiện màn hình loading đen
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Đã đăng nhập -> Hiển thị layout chọn ghế
  // Chú ý: Ở đây ta KHÔNG bọc layout.tsx vì trang Booking thường chiếm full màn hình (không hiện Footer)
  return <SeatSelectionLayout timeId={params.id} />;
}
