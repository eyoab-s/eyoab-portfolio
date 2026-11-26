import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import AmbientField from "@/components/animations/AmbientField";
import ProgressRail from "@/components/animations/ProgressRail";
import Reveal from "@/components/animations/Reveal";
import Ticker from "@/components/animations/Ticker";

export default function Home() {
  return (
    <>
      <AmbientField />
      <ProgressRail />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Ticker />
        <Reveal>
          <Projects />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Reveal>
          <Contact />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}