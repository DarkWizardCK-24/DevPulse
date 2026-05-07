import Image from 'next/image';
import Link from 'next/link';
import { IoHeartOutline } from 'react-icons/io5';
import { RiGithubLine, RiTwitterXLine } from 'react-icons/ri';

const REPO_URL = 'https://github.com/DarkWizardCK-24/DevPulse';

const links = {
  product: [
    { href: '/analyzer', label: 'Analyzer' },
    { href: '/playground', label: 'Playground' },
  ],
  resources: [
    { href: 'https://docs.github.com/en/rest', label: 'GitHub API', external: true },
    { href: 'https://nextjs.org', label: 'Next.js', external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-surface mt-auto">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group w-fit">
              <div className="relative w-7 h-7 flex items-center justify-center rounded-md overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="DevPulse"
                  width={28}
                  height={28}
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <span className="font-display text-sm font-bold tracking-wider text-white">
                Dev<span className="text-green-pulse">Pulse</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm font-mono leading-relaxed max-w-xs">
              Smart developer tool for analyzing GitHub repositories and testing APIs
              interactively — all in one place.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="p-2 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:border-[#333] transition-all duration-200"
              >
                <RiGithubLine size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:border-[#333] transition-all duration-200"
              >
                <RiTwitterXLine size={15} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display text-xs tracking-widest text-text-secondary uppercase mb-4">
              Product
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.product.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-mono text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-xs tracking-widest text-text-secondary uppercase mb-4">
              Resources
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.resources.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="text-sm font-mono text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted font-mono">
            © 2026 DevPulse. MIT License.
          </p>
          <p className="text-xs text-text-muted font-mono flex items-center gap-1">
            Built with <IoHeartOutline className="text-red-pulse mx-0.5" size={12} /> by{' '}
            <span className="text-text-secondary">Chaitanya</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
