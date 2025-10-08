import React from 'react';
import { Globe } from 'lucide-react';

/*
  LanguageToggle Component
  Props:
    - language: current language code ('he' | 'en')
    - onToggle: function to switch languages
    - variant: 'desktop' | 'mobile'
    - transparent: boolean (for home page hero style)
*/
export function LanguageToggle({ language = 'he', onToggle, variant = 'desktop', transparent = false }) {
  const isHebrew = language === 'he';
  const label = isHebrew ? 'EN' : 'עב';

  const base = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 group overflow-hidden';
  const sizing = variant === 'desktop'
    ? 'px-4 py-3 rounded-2xl text-sm'
    : 'p-2.5 rounded-xl text-sm';

  const glassHome = 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md';
  const solidPage = 'bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-300/60 hover:border-gray-400 backdrop-blur-md';

  const accentRing = transparent
    ? 'after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-white/20 after:shadow-[0_0_0_0_rgba(255,255,255,0.2)] group-hover:after:shadow-[0_0_0_6px_rgba(255,255,255,0.08)] after:transition-all after:duration-500'
    : 'after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-blue-300/40 after:shadow-[0_0_0_0_rgba(59,130,246,0.25)] group-hover:after:shadow-[0_0_0_6px_rgba(59,130,246,0.10)] after:transition-all after:duration-500';

  const activeGlow = transparent
    ? 'before:absolute before:-inset-px before:bg-gradient-to-br before:from-white/25 before:via-white/5 before:to-white/10 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 before:rounded-[inherit]'
    : 'before:absolute before:-inset-px before:bg-gradient-to-br before:from-blue-200/50 before:via-blue-100/30 before:to-blue-200/40 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500 before:rounded-[inherit]';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        base,
        sizing,
        transparent ? glassHome : solidPage,
        accentRing,
        activeGlow,
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-transparent'
      ].join(' ')}
      aria-label="Toggle language"
    >
      <span className="relative flex items-center gap-2 z-10">
        <Globe className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="tracking-wide font-semibold">
          {label}
        </span>
      </span>
      {/* Subtle animated highlight */}
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </button>
  );
}

export default LanguageToggle;
