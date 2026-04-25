"use client";

import React, { useEffect, useState } from "react";
import { checkoutService } from "@/src/services/checkout.service";
import { FoodDrink, OrderRequest, Coupon, Merchandise, PaymentRequest } from "@/src/types/checkout.type";
import { Seat } from "@/src/types/booking.type";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { toast } from "sonner";

export default function CheckoutLayout() {
  const router = useRouter();

  // --- 1. STATES ---
  const [bookingData, setBookingData] = useState<{
    timeId: string;
    seats: Seat[];
    seatsTotal: number;
    movieName?: string;
    showtimeInfo?: string;
  } | null>(null);

  const [foodDrinks, setFoodDrinks] = useState<FoodDrink[]>([]);
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MOMO");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 2. EFFECTS ---
  useEffect(() => {
    // 1. Lấy dữ liệu từ bước chọn ghế
    const data = sessionStorage.getItem("booking_temp_data");
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      router.push("/");
    }

    // 2. Lấy danh sách bắp nước & merchandise & coupons
    const fetchData = async () => {
      try {
        const [fdRes, merchRes, couponRes] = await Promise.all([
          checkoutService.getFoodDrinks(),
          checkoutService.getMerchandise(),
          checkoutService.getCoupons(),
        ]);

        if (fdRes.success) {
          setFoodDrinks(fdRes.data.map((i) => ({ ...i, selectedQuantity: 0 })));
        }
        if (merchRes.success) {
          setMerchandise(merchRes.data.map((i) => ({ ...i, selectedQuantity: 0 })));
        }
        if (couponRes.success) {
          setCoupons(couponRes.data.filter((c) => c.isActive));
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, [router]);

  // --- 3. LOGIC HANDLERS ---
  const updateItemQty = (productId: number, delta: number, type: "FD" | "MERCH") => {
    if (type === "FD") {
      setFoodDrinks((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, selectedQuantity: Math.max(0, (item.selectedQuantity || 0) + delta) }
            : item,
        ),
      );
    } else {
      setMerchandise((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, selectedQuantity: Math.max(0, (item.selectedQuantity || 0) + delta) }
            : item,
        ),
      );
    }
  };

  const foodTotal = foodDrinks.reduce(
    (sum, item) => sum + item.price * (item.selectedQuantity || 0),
    0,
  );
  const merchTotal = merchandise.reduce(
    (sum, item) => sum + item.price * (item.selectedQuantity || 0),
    0,
  );

  const subTotal = (bookingData?.seatsTotal || 0) + foodTotal + merchTotal;
  const discountAmount = selectedCoupon ? (subTotal * selectedCoupon.saleOff) / 100 : 0;
  const totalAmount = subTotal - discountAmount;

  const handlePayment = async () => {
    if (!bookingData) return;
    setIsProcessing(true);

    try {
      const payload: OrderRequest = {
        paymentMethod: paymentMethod,
        couponId: selectedCoupon?.couponId,
        tickets: bookingData.seats.map((s) => ({
          showtimeId: Number(bookingData.timeId),
          branchId: s.branchId || 1,
          roomId: s.roomId || 1,
          sRow: s.sRow,
          sColumn: s.sColumn,
          tPrice: s.price,
        })),
        addons: [
          ...foodDrinks
            .filter((fd) => (fd.selectedQuantity || 0) > 0)
            .map((fd) => ({
              productId: fd.productId,
              pType: fd.pType,
              pName: fd.pName,
              quantity: fd.selectedQuantity || 0,
              price: fd.price,
            })),
          ...merchandise
            .filter((m) => (m.selectedQuantity || 0) > 0)
            .map((m) => ({
              productId: m.productId,
              pType: "MERCHANDISE",
              pName: m.merchName,
              quantity: m.selectedQuantity || 0,
              price: m.price,
            })),
        ],
      };

      const res = await checkoutService.createOrder(payload);

      if (res.success) {
        const paymentPayload: PaymentRequest = {
          orderId: res.data.orderId,
          amount: totalAmount,
          paymentMethod: paymentMethod
        }
        const resPayment = await checkoutService.createPayment(paymentPayload);
        if (resPayment.success && resPayment.data.paymentUrl) {
          // Subscribe SSE trước khi chuyển hướng (hoặc nếu mở tab mới)
          checkoutService.subscribePaymentStatus(res.data.orderId);

          window.location.href = resPayment.data.paymentUrl;
        } else {
          sessionStorage.removeItem("booking_temp_data");
          router.push(`/checkout/status?status=success&orderId=${res.data.orderId}`);
        }
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto min-h-screen bg-background text-on-surface relative">

      {/* HEADER PROGRESS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight mb-2 text-white">
            BẮP NƯỚC & THANH TOÁN
          </h1>
          <div className="flex items-center gap-4 text-sm text-on-surface-variant uppercase font-bold tracking-widest">
            <span className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>{" "}
              Chọn ghế
            </span>
            <span className="w-8 h-[1px] bg-surface-variant"></span>
            <span className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm">
                check_circle
              </span>{" "}
              Bắp nước
            </span>
            <span className="w-8 h-[1px] bg-surface-variant"></span>
            <span className="flex items-center gap-1 text-white">
              Thanh toán
            </span>
          </div>
        </div>

        <div className="bg-surface-container-high px-6 py-3 rounded-xl border border-primary/20 flex items-center gap-4 self-start">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Thời gian giữ vé
            </span>
            <span className="font-headline text-2xl font-black text-primary leading-none">
              05:00
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: COMBO & THANH TOÁN */}
        <div className="lg:col-span-8 space-y-10">
          {/* Section: Combo */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline text-xl font-bold tracking-widest uppercase text-white">
                Combo Ưu Đãi
              </h2>
            </div>
            <div className="pt-2">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView="auto"
                freeMode={true}
                className="combo-swiper"
              >
                {foodDrinks.map((item) => (
                  <SwiperSlide key={item.productId} className="!w-72">
                    <div className="bg-surface-container-low p-4 rounded-2xl flex gap-4 transition-all hover:bg-surface-container-high group border border-white/5 h-full">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center">
                        {item.imgUrl ? (
                          <img
                            src={item.imgUrl}
                            alt={item.pName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                            fastfood
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="font-bold text-white leading-tight text-sm line-clamp-1">
                            {item.pName}
                          </h3>
                          <p className="text-[10px] text-primary uppercase font-bold tracking-tighter mt-1">
                            {item.pType}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-primary font-bold text-sm">
                            {item.price.toLocaleString("vi-VN")}đ
                          </span>
                          <div className="flex items-center gap-3 bg-surface-container-highest px-2 py-1 rounded-full">
                            <button
                              onClick={() =>
                                updateItemQty(item.productId, -1, "FD")
                              }
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary hover:text-on-primary transition-colors text-white"
                            >
                              <span className="material-symbols-outlined text-sm">
                                remove
                              </span>
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-white">
                              {item.selectedQuantity || 0}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQty(item.productId, 1, "FD")
                              }
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-on-primary hover:opacity-80 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                add
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>

          {/* Section: Merchandise */}
          <section>
            <h2 className="font-headline text-xl font-bold tracking-widest uppercase mb-6 text-white">
              Vật phẩm lưu niệm
            </h2>
            <div className="pt-2">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView="auto"
                freeMode={true}
                className="merch-swiper"
              >
                {merchandise.map((item) => (
                  <SwiperSlide key={item.productId} className="!w-72">
                    <div className="bg-surface-container-low p-4 rounded-2xl flex gap-4 transition-all hover:bg-surface-container-high group border border-white/5 h-full">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center">
                        {item.imgUrl ? (
                          <img
                            src={item.imgUrl}
                            alt={item.merchName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                            toy_brick
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="font-bold text-white leading-tight text-sm line-clamp-1">
                            {item.merchName}
                          </h3>
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter mt-1">
                            Còn lại: {item.availNum}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-primary font-bold text-sm">
                            {item.price.toLocaleString("vi-VN")}đ
                          </span>
                          <div className="flex items-center gap-3 bg-surface-container-highest px-2 py-1 rounded-full">
                            <button
                              onClick={() =>
                                updateItemQty(item.productId, -1, "MERCH")
                              }
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary hover:text-on-primary transition-colors text-white"
                            >
                              <span className="material-symbols-outlined text-sm">
                                remove
                              </span>
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-white">
                              {item.selectedQuantity || 0}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQty(item.productId, 1, "MERCH")
                              }
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-on-primary hover:opacity-80 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">
                                add
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>

          {/* Section: Coupon */}
          <section>
            <h2 className="font-headline text-xl font-bold tracking-widest uppercase mb-6 text-white">
              Ưu đãi dành cho bạn
            </h2>
            <div className="pt-2">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView="auto"
                freeMode={true}
                className="coupon-swiper"
              >
                {coupons.map((coupon) => {
                  const isSelected =
                    selectedCoupon?.couponId === coupon.couponId;
                  return (
                    <SwiperSlide key={coupon.couponId} className="!w-64">
                      <div
                        onClick={() =>
                          setSelectedCoupon(isSelected ? null : coupon)
                        }
                        className={`w-full h-24 rounded-2xl flex items-center cursor-pointer transition-all border-2 relative overflow-hidden ${isSelected
                          ? "bg-primary border-primary"
                          : "bg-surface-container-low border-white/10 hover:border-primary/50"
                          }`}
                      >
                        {/* Ticket UI: Left Notch */}
                        <div className="absolute -left-2 w-4 h-4 rounded-full bg-background"></div>
                        {/* Ticket UI: Right Notch */}
                        <div className="absolute -right-2 w-4 h-4 rounded-full bg-background"></div>

                        <div className="flex-grow flex flex-col items-center justify-center px-4 border-r border-dashed border-white/20">
                          <span
                            className={`text-2xl font-black ${isSelected ? "text-on-primary" : "text-primary"
                              }`}
                          >
                            {coupon.saleOff}%
                          </span>
                          <span
                            className={`text-[8px] uppercase font-bold tracking-widest ${isSelected
                              ? "text-on-primary/70"
                              : "text-on-surface-variant"
                              }`}
                          >
                            Discount
                          </span>
                        </div>

                        <div className="px-4 space-y-1">
                          <p
                            className={`text-[10px] font-bold ${isSelected ? "text-on-primary" : "text-white"
                              }`}
                          >
                            HSD:{" "}
                            {new Date(coupon.endDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                          <p
                            className={`text-[8px] ${isSelected
                              ? "text-on-primary/80"
                              : "text-on-surface-variant"
                              }`}
                          >
                            Số lượng còn: {coupon.availNum}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </section>

          {/* Section: Phương thức thanh toán */}
          <section>
            <h2 className="font-headline text-xl font-bold tracking-widest uppercase mb-6 text-white">
              Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "MOMO",
                  name: "Ví điện tử MoMo",
                  brand: "MOMO",
                  color: "bg-[#a50064]",
                },
                {
                  id: "VNPAY",
                  name: "VNPAY - Quét mã QR",
                  brand: "VNPAY",
                  color: "bg-white text-blue-600",
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer border-2 transition-all ${paymentMethod === method.id
                    ? "border-primary bg-surface-container-high"
                    : "border-transparent hover:border-primary/30"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-10 ${method.color} rounded-lg flex items-center justify-center font-black text-[10px] uppercase shadow-inner`}
                    >
                      {method.brand}
                    </div>
                    <span className="font-semibold text-white">
                      {method.name}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-primary bg-surface-container-highest border-none focus:ring-offset-background"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 glass-card rounded-2xl p-6 shadow-2xl border border-white/5">
            <h2 className="font-headline text-2xl font-black text-center mb-1 text-white uppercase italic tracking-tighter">
              TÓM TẮT ĐƠN HÀNG
            </h2>
            <p className="text-xs text-primary font-bold text-center uppercase tracking-[0.3em] mb-6">
              Director’s Cut
            </p>

            <div className="space-y-4 text-sm mb-8 border-b border-white/10 pb-8 text-on-surface-variant">
              <div className="flex justify-between">
                <span>Ghế đã chọn:</span>
                <span className="font-bold text-primary">
                  {bookingData.seats
                    .map((s) => s.rowName + s.number)
                    .join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tiền ghế:</span>
                <span className="font-semibold text-white">
                  {bookingData.seatsTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {foodDrinks
                .filter((fd) => (fd.selectedQuantity || 0) > 0)
                .map((fd) => (
                  <div
                    key={fd.productId}
                    className="flex justify-between animate-in fade-in slide-in-from-right-2"
                  >
                    <span className="w-2/3 truncate">
                      {fd.selectedQuantity}x {fd.pName}
                    </span>
                    <span className="font-semibold text-white">
                      {(fd.price * (fd.selectedQuantity || 0)).toLocaleString(
                        "vi-VN",
                      )}
                      đ
                    </span>
                  </div>
                ))}

              {merchandise
                .filter((m) => (m.selectedQuantity || 0) > 0)
                .map((m) => (
                  <div
                    key={m.productId}
                    className="flex justify-between animate-in fade-in slide-in-from-right-2"
                  >
                    <span className="w-2/3 truncate">
                      {m.selectedQuantity}x {m.merchName}
                    </span>
                    <span className="font-semibold text-white">
                      {(m.price * (m.selectedQuantity || 0)).toLocaleString(
                        "vi-VN",
                      )}
                      đ
                    </span>
                  </div>
                ))}
            </div>

            <div className="space-y-2 mb-8 border-b border-white/10 pb-8">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Tạm tính:</span>
                <span className="text-white font-medium">
                  {subTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
              {selectedCoupon && (
                <div className="flex justify-between text-sm text-green-500">
                  <span>Giảm giá ({selectedCoupon.saleOff}%):</span>
                  <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-end pt-4">
                <span className="font-bold text-lg uppercase tracking-tighter text-white">
                  Tổng thanh toán
                </span>
                <span className="font-headline text-3xl font-black text-primary animate-in fade-in duration-500">
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-full font-headline font-black text-lg tracking-widest uppercase shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                  ĐANG XỬ LÝ...
                </>
              ) : (
                "THANH TOÁN NGAY"
              )}
            </button>

            <p className="text-[10px] text-center text-on-surface-variant mt-6 leading-relaxed px-4 italic">
              Bằng việc nhấn Thanh toán, bạn đồng ý với các Điều khoản & Chính
              sách bảo mật của CMS.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
