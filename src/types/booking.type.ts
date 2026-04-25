export type SeatType = "STANDARD" | "VIP" | "SWEETBOX";

export interface Seat {
  sRow: number;
  branchId?: number;
  roomId?: number;
  sColumn: number;
  rowName: string; // VD: 'A', 'B'
  number: string; // VD: '1', '2'
  type: SeatType;
  sType: number; // Mapping from BE
  sStatus: boolean; // Trạng thái ghế (hoạt động/không)
  isBooked: boolean;
  price: number;
}

export interface ShowtimeDetails {
  timeId: number;
  movieName: string;
  branchName: string;
  roomName: string;
  startTime: string; // HH:mm
  date: string; // DD/MM/YYYY
}
