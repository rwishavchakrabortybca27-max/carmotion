import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 py-12 px-6 md:px-12 text-neutral-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-display font-bold text-white text-base tracking-wider uppercase">
            ITZFIZZ·AERO
          </span>
          <p className="mt-1 text-neutral-500 font-light">
            Scroll-Driven Hypercar Animation & Interaction Engineering Showcase.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] text-neutral-400">
          <a
            href="https://paraschaturvedi.github.io/car-scroll-animation"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors"
          >
            Reference Demo ↗
          </a>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>GSAP ScrollTrigger Engine</span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <span>Compositor Acceleration</span>
        </div>

        <div className="text-neutral-500 font-mono text-[11px]">
          © {new Date().getFullYear()} ItzFizz Aero. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
