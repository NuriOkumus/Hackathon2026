export const dynamic = "force-static";
export const revalidate = 3600;

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import HowToApply from "@/components/HowToApply";
import Rules from "@/components/Rules";
import Prizes from "@/components/Prizes";
import Venue from "@/components/Venue";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30">
      <Header />

      <Hero />
      <TrustBar />
      <About />
      <Timeline />
      <HowToApply />
      <Rules />
      <Prizes />
      <Venue />
      <FAQ />
      <Footer />
    </main>
  );
}
