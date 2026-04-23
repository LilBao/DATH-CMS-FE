export type SeatType = "STANDARD" | "VIP" | "SWEETBOX";

export interface Seat {
  seatId: number;
  rowName: string; // VD: 'A', 'B'
  number: string; // VD: '1', '2'
  type: SeatType;
  isBooked: boolean; // Trạng thái đã bán hay chưa (dựa vào bảng Ticket trong BE)
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
