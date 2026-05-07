'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  RiGithubLine,
  RiTerminalBoxLine,
  RiBrainLine,
  RiBarChartLine,
  RiCodeSSlashLine,
  RiTimeLine,
} from 'react-icons/ri';
import { IoArrowForwardOutline, IoSparklesOutline } from 'react-icons/io5';

const features = [
  {
    icon: RiGithubLine,
    title: 'GitHub Repo Analyzer',
    description:
      'Analyze any public repository instantly. Detect tech stack, view language distribution, explore file structure, and get repo stats in seconds.',
    accent: 'green',
    href: '/analyzer',
    available: true,
    highlights: ['Tech stack detection', 'Language percentages', 'Stars & forks', 'File structure'],
  },
  {
    icon: RiTerminalBoxLine,
    title: 'API Playground',
    description:
      'Test REST APIs interactively. Send GET, POST, PUT, DELETE requests with custom headers and body — see formatted responses instantly.',
    accent: 'cyan',
    href: '/playground',
    available: true,
    highlights: ['All HTTP methods', 'Custom headers', 'JSON body editor', 'Response viewer'],
  },
  {
    icon: RiBrainLine,
    title: 'AI Code Insights',
    description:
      'Coming soon — AI-powered analysis of repository code. Get intelligent suggestions, detect patterns, and understand architecture at a glance.',
    accent: 'purple',
    href: '#',
    available: false,
    highlights: ['Code patterns', 'Architecture review', 'Quality score', 'Suggestions'],
  },
];

const extraFeatures = [
  { icon: RiBarChartLine, title: 'Repo Comparison', desc: 'Compare multiple repositories side by side', coming: true },
  { icon: RiCodeSSlashLine, title: 'Mock API Server', desc: 'Create mock endpoints for frontend testing', coming: true },
  { icon: RiTimeLine, title: 'API Collections', desc: 'Save and organize your API requests', coming: true },
];

const accentMap: Record<string, string> = {
  green: 'border-[rgba(0,255,136,0.2)] hover:border-[rgba(0,255,136,0.4)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.9),0_0_32px_rgba(0,255,136,0.12)]',
  cyan: 'border-[rgba(0,212,255,0.2)] hover:border-[rgba(0,212,255,0.4)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.9),0_0_32px_rgba(0,212,255,0.12)]',
  purple: 'border-[rgba(168,85,247,0.15)] hover:border-[rgba(168,85,247,0.3)] hover:shadow-[0_16px_64px_rgba(0,0,0,0.9),0_0_24px_rgba(168,85,247,0.1)]',
};

const iconBgMap: Record<string, string> = {
  green: 'bg-[rgba(0,255,136,0.08)] text-green-pulse',
  cyan: 'bg-[rgba(0,212,255,0.08)] text-cyan-pulse',
  purple: 'bg-[rgba(168,85,247,0.08)] text-purple-pulse',
};

const dotMap: Record<string, string> = {
  green: 'bg-green-pulse',
  cyan: 'bg-cyan-pulse',
  purple: 'bg-purple-pulse',
};

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,255,136,0.015)] to-transparent pointer-events-none" />

      <div className="container-app relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-default bg-bg-elevated mb-4">
            <IoSparklesOutline className="text-green-pulse" size={13} />
            <span className="text-xs font-mono text-text-secondary tracking-widest uppercase">
              Features
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to{' '}
            <span className="text-gradient-green">ship faster</span>
          </h2>
          <p className="text-text-secondary font-mono text-sm max-w-xl mx-auto leading-relaxed">
            A unified workspace for exploring codebases and testing APIs — no setup required.
          </p>
        </motion.div>

        {/* Main feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {features.map(({ icon: Icon, title, description, accent, href, available, highlights }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative group bg-bg-card border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${accentMap[accent]} ${!available ? 'opacity-70' : ''}`}
            >
              {!available && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(168,85,247,0.1)] border border-[rgba(168,85,247,0.2)]">
                  <IoSparklesOutline className="text-purple-pulse" size={10} />
                  <span className="text-[10px] font-mono text-purple-pulse">Soon</span>
                </div>
              )}

              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${iconBgMap[accent]}`}>
                <Icon size={22} />
              </div>

              <h3 className="font-display text-base font-bold text-white mb-3">{title}</h3>
              <p className="text-text-secondary text-sm font-mono leading-relaxed mb-5">{description}</p>

              <ul className="flex flex-col gap-2 mb-6">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs font-mono text-text-secondary">
                    <span className={`w-1 h-1 rounded-full shrink-0 ${dotMap[accent]}`} />
                    {h}
                  </li>
                ))}
              </ul>

              {available ? (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors group/link"
                >
                  Try it now
                  <IoArrowForwardOutline
                    size={12}
                    className="group-hover/link:translate-x-0.5 transition-transform"
                  />
                </Link>
              ) : (
                <span className="text-xs font-mono text-text-muted">Coming soon</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Extra feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {extraFeatures.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-4 rounded-xl bg-bg-elevated border border-border-subtle hover:border-border-default transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-bg-card border border-border-subtle flex items-center justify-center shrink-0">
                <Icon className="text-text-muted" size={15} />
              </div>
              <div>
                <p className="text-sm font-mono text-text-secondary">{title}</p>
                <p className="text-xs font-mono text-text-muted mt-0.5">{desc}</p>
              </div>
              <span className="ml-auto text-[10px] font-mono text-text-muted border border-border-subtle rounded px-1.5 py-0.5 shrink-0">
                soon
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
