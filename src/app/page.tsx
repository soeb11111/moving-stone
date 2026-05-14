import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { CollectionSection } from '@/components/sections/CollectionSection';
import { TrendingSection } from '@/components/sections/TrendingSection';
import { DiscoverLines } from '@/components/sections/DiscoverLines';
import { NewReleases } from '@/components/sections/NewReleases';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CollectionSection />
        <TrendingSection />
        <DiscoverLines />
        <NewReleases />
      </main>
      <Footer />
    </>
  );
}
