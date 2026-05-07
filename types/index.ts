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

export interface AnalyzerState {
  repo: RepoData | null;
  languages: LanguageData | null;
  contents: ContentItem[] | null;
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
