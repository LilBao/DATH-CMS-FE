import CinemasPage from "@/src/features/cinemas/components/CinemasPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hệ thống Rạp Phim | CMS Cinema",
  description: "Tìm kiếm rạp phim CMS gần bạn nhất",
};

export default function Page() {
  return <CinemasPage />;
}
