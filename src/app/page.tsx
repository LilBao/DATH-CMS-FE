import {
  HeroSection,
  NowShowingSection,
  PremiumPromoSection,
} from "../features/home";

export default function HomePage() {
  return (
    // Thêm thẻ main và class pt-20
    <main className="relative min-h-screen pt-20">
      <HeroSection />
      <NowShowingSection />
      <PremiumPromoSection />
    </main>
  );
}
