export type SeatType = "STANDARD" | "VIP" | "SWEETBOX";

export interface Seat {
  sRow: number;
  branchId?: number;
  roomId?: number;
  sColumn: number;
  rowName: string; // VD: 'A', 'B'
  number: string; // VD: '1', '2'
  sType: number; // Mapping from BE
  sStatus: boolean; // Trạng thái ghế (hoạt động/không)
  isBooked: boolean;
  sPrice: number; // New price field from BE
}

export interface ScreenRoom {
  branchId: number;
  roomId: number;
  rType: string;
  rCapacity: number;
  basePrice: number;
  totalSeats: number;
}

export interface ShowtimeDetails {
  timeId: number;
  movieId: number;
  movieName: string;
  branchId: number;
  branchName: string;
  roomId: number;
  rType: string;
  rPrice: number;
  formatName: string;
  day: string; // "YYYY-MM-DD"
  date?: string; // Legacy field
  startTime: string; // HH:mm:ss
  endTime: string;
  status: string;
}
