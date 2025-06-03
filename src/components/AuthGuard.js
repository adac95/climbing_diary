'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getSupabase } from '@app/data/supabaseClient';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const supabase = getSupabase();

  useEffect(() => {
    let subscription;
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/login');
      }
    });
    subscription = data?.subscription;
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router, supabase]);
  return <>{children}</>;
}
