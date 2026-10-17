import { HomeHeader } from './components/HomeHeader';
import { HomeHero } from './components/HomeHero';
import { HomeRoomsSection } from './components/HomeRoomsSection';
import { HomeFeaturesSection } from './components/HomeFeaturesSection';
import { HomeFooter } from './components/HomeFooter';

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HomeHeader />
      <main className="flex-1">
        <HomeHero />
        <HomeRoomsSection />
        <HomeFeaturesSection />
      </main>
      <HomeFooter />
    </div>
  );
}
