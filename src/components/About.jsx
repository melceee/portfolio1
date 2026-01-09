import React from "react";
import AboutMiniGame from "./AboutMiniGame";

/**
 * Local Error Boundary so if the mini-game crashes,
 * the rest of the page still loads (no white screen).
 */
class AboutSectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("About section crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold text-white">
            About interactive feature failed to load
          </h3>
          <p className="mt-2 text-sm text-neutral-300">
            The rest of the portfolio is fine — only the interactive widget crashed.
          </p>
          <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-neutral-200">
            {String(this.state.error)}
          </pre>
          <p className="mt-3 text-xs text-neutral-400">
            Tip: check the browser console for the full error message.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT: About Text */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-white">About</h2>

          <p className="mt-3 text-neutral-300 leading-relaxed">
            I am a Bachelor of Science in Computer Engineering graduate from Mapúa
            Malayan Colleges Laguna with a strong foundation in software development,
            data structures, and system design. I enjoy building practical applications
            and learning through real projects.
          </p>

          <p className="mt-3 text-neutral-300 leading-relaxed">
            During my internship, I worked on a full-stack appointment booking system
            involving frontend interfaces, backend API integration, database configuration,
            and automated testing.
          </p>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-white">What I’m good at</h3>

            <ul className="mt-4 space-y-3 text-neutral-300">
              <li className="rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                <p className="font-semibold text-white">Building clean UI</p>
                <p className="mt-1 text-sm text-neutral-400">
                  Component structure, responsive layout, modern styling
                </p>
              </li>

              <li className="rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                <p className="font-semibold text-white">Testing & quality</p>
                <p className="mt-1 text-sm text-neutral-400">
                  Playwright automation, flow validation, bug reproduction
                </p>
              </li>

              <li className="rounded-2xl border border-white/10 bg-neutral-950/30 p-4">
                <p className="font-semibold text-white">Problem solving</p>
                <p className="mt-1 text-sm text-neutral-400">
                  Debugging, API integration issues, step-by-step solutions
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Interactive Mini Game */}
        <AboutSectionErrorBoundary>
          <AboutMiniGame />
        </AboutSectionErrorBoundary>
      </div>
    </section>
  );
}
