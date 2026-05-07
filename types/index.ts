export interface RepoOwner {
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface RepoLicense {
  name: string;
  spdx_id: string;
}

export interface RepoData {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;
  language: string | null;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  visibility: string;
  topics: string[];
  owner: RepoOwner;
  license: RepoLicense | null;
  archived: boolean;
  fork: boolean;
  subscribers_count: number;
}

export interface LanguageData {
  [language: string]: number;
}

export interface ContentItem {
  name: string;
  type: 'file' | 'dir';
  size: number;
  path: string;
  sha: string;
}

export interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

export interface CommitData {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: CommitAuthor;
    committer: CommitAuthor;
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}

export interface ContributorData {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface BranchData {
  name: string;
  commit: { sha: string; url: string };
  protected: boolean;
}

export interface ReleaseData {
  id: number;
  name: string | null;
  tag_name: string;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface AnalyzerState {
  repo: RepoData | null;
  languages: LanguageData | null;
  contents: ContentItem[] | null;
  commits: CommitData[] | null;
  contributors: ContributorData[] | null;
  branches: BranchData[] | null;
  releases: ReleaseData[] | null;
  loading: boolean;
  error: string | null;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  time: number;
  size: number;
}

export interface PlaygroundState {
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  accent: string;
  coming?: boolean;
}

export interface StatItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}
