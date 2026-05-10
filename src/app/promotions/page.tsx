import PromotionsPage from "@/src/features/promotions/components/PromotionsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khuyến mãi | CMS Cinema",
  description: "Các chương trình ưu đãi và khuyến mãi hấp dẫn tại CMS Cinema",
};

export default function Page() {
  return <PromotionsPage />;
}
