export interface FoodDrink {
  productId: number;
  pType: string;
  pName: string;
  price: number;
  quantity: number; // Stock quantity from BE
  itemType: string;
  imgUrl?: string; // Image URL from BE
  selectedQuantity?: number; // Added for UI selection
}

export interface OrderRequest {
  paymentMethod: string;
  couponId?: number;
  tickets: {
    showtimeId: number;
    branchId: number;
    roomId: number;
    sRow: number;
    sColumn: number;
    tPrice: number;
  }[];
  addons: {
    productId: number;
    pType: string;
    pName: string;
    quantity: number;
    price: number;
  }[];
}

export interface OrderResponse {
  orderId: number;
  orderTime: string;
  paymentMethod: string;
  originalTotal: number;
  discountAmount: number;
  total: number;
  orderStatus: string;
  paymentUrl: string;
}

export interface Coupon {
  couponId: number;
  startDate: string;
  endDate: string;
  saleOff: number;
  releaseNum: number;
  availNum: number;
  isActive: boolean;
}

export interface Merchandise {
  productId: number;
  merchName: string;
  price: number;
  availNum: number;
  startDate: string;
  endDate: string;
  imgUrl?: string; // Image URL from BE
  selectedQuantity?: number; // UI state
}

export interface PaymentRequest {
  orderId: number;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  paymentUrl: string;
  message: string;
  status: string;
}