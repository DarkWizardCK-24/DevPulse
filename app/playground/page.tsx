import type { Metadata } from 'next';
import ApiPlayground from '@/components/playground/ApiPlayground';
import { RiTerminalBoxLine } from 'react-icons/ri';

export const metadata: Metadata = {
  title: 'API Playground — DevPulse',
  description: 'Test REST APIs interactively. Send GET, POST, PUT, DELETE requests with custom headers and body, and view formatted JSON responses.',
};

export default function PlaygroundPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-app max-w-4xl">
        {/* Page header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)] mb-4">
            <RiTerminalBoxLine className="text-cyan-pulse" size={13} />
            <span className="text-xs font-mono text-cyan-pulse tracking-widest uppercase">
              API Playground
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
            API Playground
          </h1>
          <p className="text-text-secondary font-mono text-sm max-w-2xl leading-relaxed">
            Test any REST API directly in your browser. Add custom headers, craft JSON request
            bodies, and inspect formatted responses — no tools required.
          </p>
        </div>

        <ApiPlayground />
      </div>
    </div>
  );
}
