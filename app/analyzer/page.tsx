import type { Metadata } from 'next';
import RepoAnalyzer from '@/components/analyzer/RepoAnalyzer';
import { RiGithubLine } from 'react-icons/ri';

export const metadata: Metadata = {
  title: 'GitHub Repo Analyzer — DevPulse',
  description: 'Analyze any public GitHub repository. View tech stack, language breakdown, repo stats, and file structure.',
};

export default function AnalyzerPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-app">
        {/* Page header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)] mb-4">
            <RiGithubLine className="text-green-pulse" size={13} />
            <span className="text-xs font-mono text-green-pulse tracking-widest uppercase">
              Repo Analyzer
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
            GitHub Project Analyzer
          </h1>
          <p className="text-text-secondary font-mono text-sm max-w-2xl leading-relaxed">
            Enter any public GitHub repository URL to instantly view its tech stack, language
            distribution, repository stats, and file structure.
          </p>
        </div>

        <RepoAnalyzer />
      </div>
    </div>
  );
}
