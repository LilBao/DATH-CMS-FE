import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SeatLockMessage, SeatStatusMessage } from "@/src/types/websocket.type";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8081/ws";

/**
 * Singleton WebSocket client wrapper dùng STOMP over SockJS.
 *
 * Cách dùng trong component:
 *   seatWsService.connect(timeId, onSeatUpdate);
 *   seatWsService.lockSeat(timeId, sRow, sColumn);
 *   seatWsService.unlockSeat(timeId, sRow, sColumn);
 *   // trong cleanup useEffect:
 *   seatWsService.disconnect();
 */
class SeatWebSocketService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;

  /**
   * Kết nối tới WebSocket server và subscribe topic của suất chiếu.
   * @param timeId   ID suất chiếu
   * @param onUpdate Callback khi nhận được update trạng thái ghế
   */
  connect(timeId: number, onUpdate: (msg: SeatStatusMessage) => void): void {
    // Nếu đang có kết nối cũ → ngắt trước
    this.disconnect();

    this.client = new Client({
      // Dùng SockJS factory thay vì ws:// trực tiếp
      webSocketFactory: () => new SockJS(WS_URL),

      reconnectDelay: 5000,

      onConnect: () => {
        // Subscribe topic nhận broadcast ghế của suất chiếu này
        this.subscription = this.client!.subscribe(
          `/topic/seats/${timeId}`,
          (frame) => {
            try {
              const msg: SeatStatusMessage = JSON.parse(frame.body);
              onUpdate(msg);
            } catch (e) {
              console.error("[WS] Failed to parse seat status message:", e);
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error("[WS] STOMP error:", frame.headers["message"]);
      },
    });

    this.client.activate();
  }

  /** Gửi yêu cầu LOCK ghế */
  lockSeat(timeId: number, sRow: number, sColumn: number): void {
    this.sendMessage({ timeId, sRow, sColumn, action: "LOCK" });
  }

  /** Gửi yêu cầu UNLOCK ghế */
  unlockSeat(timeId: number, sRow: number, sColumn: number): void {
    this.sendMessage({ timeId, sRow, sColumn, action: "UNLOCK" });
  }

  private sendMessage(msg: SeatLockMessage): void {
    if (!this.client?.connected) {
      console.warn("[WS] Not connected, cannot send message");
      return;
    }
    this.client.publish({
      destination: "/app/seats/lock",
      body: JSON.stringify(msg),
    });
  }

  /** Ngắt kết nối (dùng trong useEffect cleanup) */
  disconnect(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.client?.deactivate();
    this.client = null;
  }
}

export const seatWsService = new SeatWebSocketService();
