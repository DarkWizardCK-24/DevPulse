export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  R: '#198CE7',
  Lua: '#000080',
  Elixir: '#6e4a7e',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  Markdown: '#083fa1',
  YAML: '#cb171e',
  JSON: '#292929',
};

export function getLanguageColor(lang: string): string {
  return LANGUAGE_COLORS[lang] ?? '#00ff88';
}

export function computeLanguagePercentages(languages: Record<string, number>): Array<{
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}> {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 1000) / 10,
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function getStatusClass(status: number): string {
  if (status >= 200 && status < 300) return 'status-200';
  if (status >= 300 && status < 400) return 'status-3xx';
  if (status >= 400 && status < 500) return 'status-4xx';
  return 'status-5xx';
}

export function prettyJson(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function getFileIcon(name: string, type: 'file' | 'dir'): string {
  if (type === 'dir') return 'folder';
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'react', js: 'javascript', jsx: 'react',
    py: 'python', rs: 'rust', go: 'go', java: 'java', rb: 'ruby',
    php: 'php', css: 'css', scss: 'scss', html: 'html', json: 'json',
    md: 'markdown', yml: 'yaml', yaml: 'yaml', sh: 'shell',
    dockerfile: 'docker', gitignore: 'git', env: 'env',
    svg: 'image', png: 'image', jpg: 'image', gif: 'image',
    lock: 'lock',
  };
  return map[ext] ?? 'file';
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
