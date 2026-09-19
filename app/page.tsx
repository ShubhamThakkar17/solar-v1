import SmoothScroll from "@/components/SmoothScroll";
import AccentDriver from "@/components/AccentDriver";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Capabilities from "@/components/Capabilities";
import BessShowcase from "@/components/BessShowcase";
import EpcProcess from "@/components/EpcProcess";
import Manufacturing from "@/components/Manufacturing";
import Segments from "@/components/Segments";
import Markets from "@/components/Markets";
import SavingsCalculator from "@/components/SavingsCalculator";
import Notify from "@/components/Notify";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <AccentDriver />
      <Nav />
      <main id="top">
        <Hero />
        <StatsBar />
        <Capabilities />
        <BessShowcase />
        <EpcProcess />
        <Manufacturing />
        <Segments />
        <Markets />
        <SavingsCalculator />
        <Notify />
      </main>
      <Footer />
    </>
  );
}
