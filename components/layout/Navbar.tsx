'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { RiGithubLine, RiTerminalBoxLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: null },
  { href: '/analyzer', label: 'Analyzer', icon: <RiGithubLine size={15} /> },
  { href: '/playground', label: 'Playground', icon: <RiTerminalBoxLine size={15} /> },
];

const REPO_URL = 'https://github.com/DarkWizardCK-24/DevPulse';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[rgba(2,2,2,0.95)] backdrop-blur-xl border-b border-border-subtle shadow-[0_4px_32px_rgba(0,0,0,0.8)]'
            : 'bg-transparent',
        )}
      >
        <div className="container-app flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt="DevPulse"
                width={32}
                height={32}
                priority
                className="object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <span className="font-display text-sm font-bold tracking-wider text-white">
              Dev<span className="text-green-pulse">Pulse</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => {
                    if (active) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200',
                    active
                      ? 'text-green-pulse'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.2)] rounded-lg pointer-events-none"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {icon}
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-text-secondary border border-border-default rounded-lg hover:text-text-primary hover:border-[#333] transition-all duration-200"
            >
              <RiGithubLine size={16} />
              <span>GitHub</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IoCloseOutline size={22} /> : <IoMenuOutline size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[rgba(2,2,2,0.98)] backdrop-blur-xl border-b border-border-subtle md:hidden"
          >
            <nav className="container-app py-4 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={(e) => {
                      if (active) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      setMenuOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200',
                      active
                        ? 'text-green-pulse bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.15)]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
                    )}
                  >
                    {icon}
                    {label}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border-subtle mt-2">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  <RiGithubLine size={16} />
                  GitHub
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
