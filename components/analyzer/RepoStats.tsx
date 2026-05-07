'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  IoStarOutline,
  IoGitNetworkOutline,
  IoAlertCircleOutline,
  IoEyeOutline,
  IoArchiveOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLockClosedOutline,
  IoGlobeOutline,
} from 'react-icons/io5';
import { RiGithubLine } from 'react-icons/ri';
import type { RepoData } from '@/types';
import { formatSize, formatDate, getRelativeTime } from '@/lib/github';
import { formatNumber } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface RepoStatsProps {
  repo: RepoData;
}

const statItems = (repo: RepoData) => [
  { icon: IoStarOutline, label: 'Stars', value: formatNumber(repo.stargazers_count), color: 'text-[#f1e05a]' },
  { icon: IoGitNetworkOutline, label: 'Forks', value: formatNumber(repo.forks_count), color: 'text-cyan-pulse' },
  { icon: IoAlertCircleOutline, label: 'Issues', value: formatNumber(repo.open_issues_count), color: 'text-orange-pulse' },
  { icon: IoEyeOutline, label: 'Watchers', value: formatNumber(repo.watchers_count), color: 'text-purple-pulse' },
  { icon: IoArchiveOutline, label: 'Size', value: formatSize(repo.size), color: 'text-green-pulse' },
];

export default function RepoStats({ repo }: RepoStatsProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header card */}
      <Card animate delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar */}
          <a href={repo.owner.html_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-border-default hover:border-[rgba(0,255,136,0.3)] transition-colors">
              <Image
                src={repo.owner.avatar_url}
                alt={repo.owner.login}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          </a>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-base font-bold text-white hover:text-green-pulse transition-colors flex items-center gap-1.5"
              >
                <RiGithubLine size={16} />
                {repo.full_name}
              </a>
              <Badge variant={repo.visibility === 'public' ? 'green' : 'gray'} dot>
                {repo.visibility}
              </Badge>
              {repo.fork && <Badge variant="cyan">fork</Badge>}
              {repo.archived && <Badge variant="orange">archived</Badge>}
            </div>

            {repo.description && (
              <p className="text-text-secondary text-sm font-mono leading-relaxed mb-3">
                {repo.description}
              </p>
            )}

            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 8).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 text-[11px] font-mono text-text-secondary bg-bg-elevated border border-border-subtle rounded-md hover:border-border-default transition-colors"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-border-subtle text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <IoCalendarOutline size={12} className="text-text-muted" />
            Created {formatDate(repo.created_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <IoTimeOutline size={12} className="text-text-muted" />
            Pushed {getRelativeTime(repo.pushed_at)}
          </span>
          {repo.license && (
            <span className="flex items-center gap-1.5">
              <IoLockClosedOutline size={12} className="text-text-muted" />
              {repo.license.name}
            </span>
          )}
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-cyan-pulse hover:text-cyan-dim transition-colors"
            >
              <IoGlobeOutline size={12} />
              Homepage
            </a>
          )}
          <span className="flex items-center gap-1.5">
            Default branch:{' '}
            <span className="text-text-secondary">{repo.default_branch}</span>
          </span>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statItems(repo).map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
            className="bg-bg-card border border-border-subtle rounded-xl p-4 flex flex-col gap-1 hover:border-border-default transition-all duration-200"
          >
            <Icon className={`${color} mb-1`} size={18} />
            <div className={`font-display text-lg font-bold ${color}`}>{value}</div>
            <div className="text-xs font-mono text-text-muted">{label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
