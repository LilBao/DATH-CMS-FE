"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status"); // success | failed
  const resultCode = searchParams.get("resultCode");
  const orderId = searchParams.get("orderId");

  const isSuccess = status === "success" || resultCode === "0";

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full glass-card p-10 rounded-3xl border border-white/10 shadow-2xl text-center animate-in fade-in zoom-in duration-500">
        {isSuccess ? (
          <>
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/10">
              <span className="material-symbols-outlined text-5xl animate-bounce">
                check_circle
              </span>
            </div>
            <h1 className="text-3xl font-headline font-black text-white mb-2 uppercase italic tracking-tighter">
              Thanh Toán Thành Công!
            </h1>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Cảm ơn bạn đã tin tưởng Cinema CMS. <br />
              Đơn hàng <span className="text-primary font-bold">#{orderId}</span> của bạn đã được xác nhận.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-error/20 text-error rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-error/10">
              <span className="material-symbols-outlined text-5xl">
                cancel
              </span>
            </div>
            <h1 className="text-3xl font-headline font-black text-white mb-2 uppercase italic tracking-tighter">
              Thanh Toán Thất Bại
            </h1>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý thanh toán cho đơn hàng <span className="text-error font-bold">#{orderId}</span>. <br />
              Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3">
          {isSuccess ? (
            <Link
              href="/profile"
              className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Xem vé của tôi
            </Link>
          ) : (
            <button
              onClick={() => router.back()}
              className="w-full bg-error text-white py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-error/20"
            >
              Thử lại thanh toán
            </button>
          )}

          <Link
            href="/"
            className="w-full bg-surface-container-high text-white py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-surface-container-highest transition-all"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}
