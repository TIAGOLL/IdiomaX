import { About } from '../components/About.tsx';
import { Cta } from '../components/Cta.tsx';
import { FAQ } from '../components/FAQ.tsx';
import { Features } from '../components/Features.tsx';
import { Footer } from '../components/Footer.tsx';
import { Hero } from '../components/Hero.tsx';
import { HowItWorks } from '../components/HowItWorks.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { Newsletter } from '../components/Newsletter.tsx';
import { Pricing } from '../components/Pricing.tsx';
import { ScrollToTop } from '../components/ScrollToTop.tsx';
import { Services } from '../components/Services.tsx';
import { Sponsors } from '../components/Sponsors.tsx';
import { Team } from '../components/Team.tsx';
import { Testimonials } from '../components/Testimonials.tsx';

export function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}
