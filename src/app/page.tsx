import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import WhyOrdersSection from '@/components/WhyOrdersSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <TestimonialsSection />
        <WhyOrdersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
