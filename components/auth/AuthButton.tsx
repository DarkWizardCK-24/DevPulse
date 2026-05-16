'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = () => {
    const devfolioUrl = process.env.NEXT_PUBLIC_DEVFOLIO_URL || 'https://dev-folio-two-rho.vercel.app';
    const callbackUrl = `${window.location.origin}/api/auth/devfolio-callback`;
    window.location.href =
      `${devfolioUrl}/api/auth/cross-app` +
      `?redirect_to=${encodeURIComponent(callbackUrl)}` +
      `&state=${encodeURIComponent(window.location.pathname)}`;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return null;

  if (user) {
    const avatar = user.user_metadata?.avatar_url;
    const name = user.user_metadata?.full_name || user.user_metadata?.user_name || user.email;
    return (
      <div className="flex items-center gap-2">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={28}
            height={28}
            className="rounded-full border border-[rgba(0,255,136,0.3)]"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[rgba(0,255,136,0.15)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center text-green-pulse text-xs font-bold">
            {(name || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="text-xs font-mono text-text-secondary hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-[#020202] bg-green-pulse rounded-lg hover:bg-[rgba(0,255,136,0.85)] transition-all duration-200 font-semibold"
    >
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
      Sign in
    </button>
  );
}
