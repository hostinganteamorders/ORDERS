import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsStrip from '@/components/StatsStrip';
import ServicesPreview from '@/components/ServicesPreview';
import LiveProjectsSection from '@/components/LiveProjectsSection';
import ProcessSection from '@/components/ProcessSection';
import AboutTeamSection from '@/components/AboutTeamSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsStrip />
        <ServicesPreview />
        <LiveProjectsSection />
        <ProcessSection />
        <AboutTeamSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
