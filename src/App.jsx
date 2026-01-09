import { useEffect, useState } from "react";
import PortalTransition from "./components/transitions/PortalTransition";
import SectionReveal from "./components/transitions/SectionReveal";

// Your sections
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import WelcomeIntro from "./components/WelcomeIntro";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [portal, setPortal] = useState(false);

  // When user enters from welcome page -> play portal transition -> show site
  const handleEnter = () => {
    setPortal(true);
    // wait for transition to sweep
    setTimeout(() => {
      setEntered(true);
    }, 650);
    // hide overlay
    setTimeout(() => {
      setPortal(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <PortalTransition show={portal} />

      {!entered ? (
        <WelcomeIntro onEnter={handleEnter} />
      ) : (
        <>
          <Navbar />

          {/* wrap each section for futuristic reveal */}
          <SectionReveal>
            <Hero />
          </SectionReveal>

          <SectionReveal>
            <About />
          </SectionReveal>

          <SectionReveal>
            <Skills />
          </SectionReveal>

          <SectionReveal>
            <Certifications />
          </SectionReveal>

          <SectionReveal>
            <Projects />
          </SectionReveal>

          <SectionReveal>
            <Contact />
          </SectionReveal>

          <Footer />
        </>
      )}
    </div>
  );
}
