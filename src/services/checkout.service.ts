import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { FoodDrink, OrderRequest, OrderResponse, Coupon, Merchandise, PaymentRequest, PaymentResponse } from "../types/checkout.type";
import { toast } from "sonner";

export const checkoutService = {
  // 1. Lấy danh sách sản phẩm (Bắp, nước...)
  getFoodDrinks: () => {
    return api.get<any, ApiResponse<FoodDrink[]>>("/food-drinks");
  },

  // 2. Lấy danh sách vật phẩm lưu niệm
  getMerchandise: () => {
    return api.get<any, ApiResponse<Merchandise[]>>("/merchandise");
  },

  // 3. Lấy danh sách coupons
  getCoupons: () => {
    return api.get<any, ApiResponse<Coupon[]>>("/coupons");
  },

  // 4. Tạo đơn hàng và thanh toán
  createOrder: (payload: OrderRequest) => {
    return api.post<any, ApiResponse<OrderResponse>>("/orders", payload);
  },

  // 5. Lấy thông tin đơn hàng theo ID
  getOrderById: (id: string) => {
    return api.get<any, ApiResponse<OrderResponse>>(`/orders/${id}`);
  },

  // 6. Lấy lịch sử đặt vé
  getOrderHistory: () => {
    return api.get<any, ApiResponse<OrderResponse[]>>("/orders");
  },

  // 7. Tạo thanh toán
  createPayment: (payload: PaymentRequest) => {
    return api.post<any, ApiResponse<PaymentResponse>>(`/payments`, payload);
  },

  // 8. Call sse
  subscribePaymentStatus: (orderId: number) => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/payments/subscribe?orderId=${orderId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("SSE data:", data);

      if (data.status === "SUCCESS") {
        toast.success("Thanh toán thành công!");
        sessionStorage.removeItem("booking_temp_data");
        eventSource.close();
        window.location.href = `/checkout/status?status=success&orderId=${orderId}`;
      }

      if (data.status === "FAILED") {
        toast.error("Thanh toán thất bại!");
        eventSource.close();
        window.location.href = `/checkout/status?status=failed&orderId=${orderId}`;
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };
  },
};
