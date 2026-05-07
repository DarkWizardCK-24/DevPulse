'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearchOutline, IoCloseCircleOutline, IoWarningOutline } from 'react-icons/io5';
import { RiGithubLine } from 'react-icons/ri';
import { fetchRepo, fetchLanguages, fetchContents, parseRepoUrl } from '@/lib/github';
import type { AnalyzerState } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RepoStats from './RepoStats';
import TechStack from './TechStack';
import ProjectStructure from './ProjectStructure';

const EXAMPLE_REPOS = [
  'facebook/react',
  'microsoft/vscode',
  'vercel/next.js',
  'tailwindlabs/tailwindcss',
  'torvalds/linux',
];

const INITIAL: AnalyzerState = {
  repo: null,
  languages: null,
  contents: null,
  loading: false,
  error: null,
};

export default function RepoAnalyzer() {
  const [input, setInput] = useState('');
  const [state, setState] = useState<AnalyzerState>(INITIAL);

  const analyze = async (value?: string) => {
    const query = (value ?? input).trim();
    if (!query) return;

    const parsed = parseRepoUrl(query);
    if (!parsed) {
      setState((s) => ({
        ...s,
        error: 'Invalid repo URL or format. Use: owner/repo or https://github.com/owner/repo',
        loading: false,
      }));
      return;
    }

    setState({ repo: null, languages: null, contents: null, loading: true, error: null });

    try {
      const [repo, languages, contents] = await Promise.all([
        fetchRepo(parsed.owner, parsed.repo),
        fetchLanguages(parsed.owner, parsed.repo),
        fetchContents(parsed.owner, parsed.repo),
      ]);
      setState({ repo, languages, contents, loading: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Something went wrong.',
      }));
    }
  };

  const clear = () => {
    setState(INITIAL);
    setInput('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[rgba(0,255,136,0.08)] flex items-center justify-center">
            <RiGithubLine className="text-green-pulse" size={18} />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold text-white">GitHub Repo Analyzer</h2>
            <p className="text-xs font-mono text-text-muted">Enter a repo URL or owner/repo</p>
          </div>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="e.g. facebook/react or https://github.com/vercel/next.js"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyze()}
              icon={<IoSearchOutline size={15} />}
              iconRight={
                input ? (
                  <IoCloseCircleOutline
                    size={15}
                    className="cursor-pointer"
                    onClick={() => setInput('')}
                  />
                ) : undefined
              }
            />
          </div>
          <Button
            onClick={() => analyze()}
            loading={state.loading}
            disabled={!input.trim()}
            size="md"
            icon={<IoSearchOutline size={15} />}
          >
            Analyze
          </Button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs font-mono text-text-muted">Try:</span>
          {EXAMPLE_REPOS.map((repo) => (
            <button
              key={repo}
              onClick={() => {
                setInput(repo);
                analyze(repo);
              }}
              className="text-xs font-mono text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-default rounded-md px-2 py-1 transition-all duration-150"
            >
              {repo}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.2)]"
          >
            <IoWarningOutline className="text-red-pulse shrink-0 mt-0.5" size={16} />
            <p className="text-sm font-mono text-red-pulse">{state.error}</p>
            <button
              onClick={clear}
              className="ml-auto text-text-muted hover:text-text-secondary transition-colors shrink-0"
            >
              <IoCloseCircleOutline size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {state.loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-bg-card border border-border-subtle rounded-xl p-5 animate-pulse"
              style={{ height: i === 1 ? 160 : 120 }}
            >
              <div className="h-4 bg-bg-elevated rounded w-1/3 mb-3" />
              <div className="h-3 bg-bg-elevated rounded w-2/3 mb-2" />
              <div className="h-3 bg-bg-elevated rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {state.repo && !state.loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xs tracking-widest text-text-secondary uppercase">
                Analysis Results
              </h3>
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear
              </Button>
            </div>

            <RepoStats repo={state.repo} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {state.languages && Object.keys(state.languages).length > 0 && (
                <TechStack languages={state.languages} />
              )}
              {state.contents && (
                <ProjectStructure
                  contents={state.contents}
                  repoName={state.repo.name}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!state.repo && !state.loading && !state.error && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mx-auto mb-4">
            <RiGithubLine className="text-text-muted" size={28} />
          </div>
          <p className="font-mono text-text-secondary text-sm">Enter a GitHub repository to analyze</p>
          <p className="font-mono text-text-muted text-xs mt-1">Public repos only · 60 requests/hour</p>
        </div>
      )}
    </div>
  );
}
