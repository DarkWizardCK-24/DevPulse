'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IoArrowForwardOutline } from 'react-icons/io5';
import { RiGithubLine, RiTerminalBoxLine } from 'react-icons/ri';
import Button from '@/components/ui/Button';

const terminalLines = [
  { text: '$ devpulse analyze facebook/react', color: 'text-text-secondary' },
  { text: '→ Fetching repository data...', color: 'text-cyan-pulse' },
  { text: '✓ Stars: 235,842  Forks: 48,204', color: 'text-green-pulse' },
  { text: '✓ Languages: JavaScript 94.2%  CSS 3.1%', color: 'text-green-pulse' },
  { text: '✓ Last push: 2h ago  License: MIT', color: 'text-green-pulse' },
  { text: '→ Running API test on endpoint...', color: 'text-cyan-pulse' },
  { text: '✓ 200 OK  •  142ms  •  4.2 KB', color: 'text-green-pulse' },
];

function TerminalAnimation() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= terminalLines.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), visibleLines === 0 ? 800 : 600);
    return () => clearTimeout(t);
  }, [visibleLines]);

  return (
    <div className="terminal-window w-full">
      <div className="terminal-header">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        <span className="ml-3 text-xs text-text-secondary font-mono">devpulse — terminal</span>
      </div>
      <div className="p-5 font-code text-sm leading-loose min-h-[200px]">
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={line.color}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines < terminalLines.length && (
          <span className="cursor-blink" />
        )}
      </div>
    </div>
  );
}

const stats = [
  { value: '60k+', label: 'API calls/hr', color: 'text-green-pulse' },
  { value: '100%', label: 'Free to use', color: 'text-cyan-pulse' },
  { value: '∞', label: 'Repos to explore', color: 'text-orange-pulse' },
];

export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-pulse opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-pulse opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container-app relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)] mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-pulse animate-pulse-glow" />
              <span className="text-xs font-mono text-green-pulse tracking-widest uppercase">
                Developer Tool v1.0
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight mb-6"
            >
              <span className="text-white">Analyze.</span>
              <br />
              <span className="text-gradient-green">Test. Build</span>
              <br />
              <span className="text-white">Smarter.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-text-secondary font-mono text-sm sm:text-base leading-relaxed max-w-lg mb-8"
            >
              DevPulse combines GitHub repository analytics with an interactive API playground —
              inspect codebases, detect tech stacks, and debug APIs without leaving your browser.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Button
                size="lg"
                icon={<RiGithubLine size={18} />}
                iconPosition="left"
                onClick={() => router.push('/analyzer')}
              >
                Analyze a Repo
              </Button>
              <Button
                size="lg"
                variant="secondary"
                icon={<RiTerminalBoxLine size={18} />}
                iconPosition="left"
                onClick={() => router.push('/playground')}
              >
                API Playground
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-6"
            >
              {stats.map(({ value, label, color }) => (
                <div key={label}>
                  <div className={`font-display text-xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-text-muted font-mono mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-green-pulse opacity-[0.03] rounded-2xl blur-2xl" />
            <TerminalAnimation />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-text-muted"
          >
            <span className="text-xs font-mono">Scroll to explore</span>
            <IoArrowForwardOutline className="rotate-90" size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
