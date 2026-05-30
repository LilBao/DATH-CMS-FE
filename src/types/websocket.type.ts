/** Message server broadcast tới client */
export interface SeatStatusMessage {
  timeId: number;
  sRow: number;
  sColumn: number;
  /** "LOCKED" | "UNLOCKED" */
  status: "LOCKED" | "UNLOCKED";
}

/** Message client gửi lên server */
export interface SeatLockMessage {
  timeId: number;
  sRow: number;
  sColumn: number;
  action: "LOCK" | "UNLOCK";
}
