export interface BranchResponse {
  branchId: number;
  bName: string;
  bAddress: string;
  managerName: string;
  managerId: string;
  phoneNumbers: string[];
  totalRooms: number;
}

export interface ScreenRoomResponse {
  branchId: number;
  roomId: number;
  rType: string;
  rCapacity: number;
  basePrice: number;
  totalSeats: number;
}
