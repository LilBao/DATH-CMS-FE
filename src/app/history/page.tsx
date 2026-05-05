import React from "react";
import PaymentHistory from "@/src/features/profile/components/PaymentHistory";

export default function HistoryPage() {
  return (
    <main className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto min-h-screen bg-background text-on-surface">
      <PaymentHistory />
    </main>
  );
}
