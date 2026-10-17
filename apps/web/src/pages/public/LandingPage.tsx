import { Header } from './Header';
import { HomeHero } from './components/HomeHero';
import { HomeDormInfoSection } from './components/HomeDormInfoSection';
import { HomeFooter } from './components/HomeFooter';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#FFF2EA] selection:text-[#F26522]">
      {/* ── 1. Clean Header with ONLY Logo and single Primary Action Button "Đăng nhập" linking directly to /login ── */}
      <Header />

      <main className="flex-1">
        {/* ── 2. Hero Section with Full Background Image (/assets/campus-building.png), Dark Overlay & Metric Stats ── */}
        <HomeHero />

        {/* ── 3. Dormitory Information Section (Clean White Card) ── */}
        <HomeDormInfoSection />
      </main>

      {/* ── 4. Minimalist Light Footer ── */}
      <HomeFooter />
    </div>
  );
}

export { LandingPage as HomePage };
export default LandingPage;
