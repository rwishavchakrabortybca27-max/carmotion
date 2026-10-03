import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroIntroHeadlineProps {
  playKey: number; // Trigger re-animation on replay
  scrollProgress: number;
}

export const HeroIntroHeadline: React.FC<HeroIntroHeadlineProps> = ({
  playKey,
  scrollProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const letters = wordsContainerRef.current?.querySelectorAll('.char-span');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Reset initial states
      gsap.set(kickerRef.current, { opacity: 0, y: 15 });
      if (letters) {
        gsap.set(letters, {
          opacity: 0,
          y: 28,
          scale: 0.96,
          filter: 'blur(8px)',
        });
      }
      gsap.set(sublineRef.current, { opacity: 0, y: 20 });

      // 1. Kicker fades in
      tl.to(kickerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.15,
      })
      // 2. Letters staggered reveal
      .to(
        letters || [],
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: {
            each: 0.045,
            from: 'start',
          },
        },
        '-=0.4'
      )
      // 3. Subline smooth arrival
      .to(
        sublineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        '-=0.3'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [playKey]);

  // Optical compensation for scroll progress: as user scrolls down, headline softly drifts up and dissolves
  const headlineOpacity = Math.max(0, 1 - scrollProgress * 4.5);
  const headlineTranslateY = -scrollProgress * 120;
  const headlineScale = 1 - scrollProgress * 0.15;

  const phraseWords = [
    { text: 'W E L C O M E', chars: ['W', 'E', 'L', 'C', 'O', 'M', 'E'] },
    { text: 'I T Z', chars: ['I', 'T', 'Z'] },
    { text: 'F I Z Z', chars: ['F', 'I', 'Z', 'Z'] },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(0, ${headlineTranslateY}px, 0) scale(${headlineScale})`,
        opacity: headlineOpacity,
        pointerEvents: headlineOpacity < 0.1 ? 'none' : 'auto',
      }}
      className="text-center w-full max-w-6xl mx-auto px-4 pt-16 md:pt-20 select-none will-change-transform"
    >
      {/* Quiet Kicker adhering to anti-slop rules (no comment slashes, clean unboxed metadata) */}
      <p
        ref={kickerRef}
        className="text-[11px] md:text-xs tracking-[0.35em] uppercase font-mono text-amber-400/90 mb-3 md:mb-5 font-semibold"
      >
        AERODYNAMICS · DYNAMICS · ELECTRIC HYPERCAR
      </p>

      {/* Main Headline: W E L C O M E   I T Z   F I Z Z */}
      <div
        ref={wordsContainerRef}
        className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.25em] md:tracking-[0.4em] text-white uppercase flex flex-wrap items-center justify-center gap-x-6 md:gap-x-12 gap-y-2 leading-none"
      >
        {phraseWords.map((wordGroup, groupIdx) => (
          <div key={groupIdx} className="inline-flex items-center">
            {wordGroup.chars.map((char, charIdx) => (
              <span
                key={`${groupIdx}-${charIdx}`}
                className="char-span inline-block transition-transform duration-200 hover:text-amber-400 hover:scale-105"
                style={{ margin: '0 0.08em' }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Concrete Value Proposition Subtitle */}
      <p
        ref={sublineRef}
        className="mt-4 md:mt-6 text-sm md:text-base text-neutral-400 max-w-2xl mx-auto font-sans font-light tracking-wide text-balance"
      >
        Scroll to command high-speed aerodynamic ground-effect and quad-inverter vectoring through interactive frame-by-frame physics.
      </p>
    </div>
  );
};
