import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

export function useAuth() {
  const { fetchUserData, clearUser } = useUserStore();

  useEffect(() => {
    console.log('[useAuth] 🚀 Hook inicializado');

    const setupAuth = async () => {
      try {
        console.log('[useAuth] 🔍 Obteniendo sesión inicial...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          console.log('[useAuth] 📱 Usuario detectado:', session.user.id);
          await fetchUserData(session.user.id);
        } else {
          console.log('[useAuth] ❌ No hay sesión');
        }
      } catch (err: any) {
        console.error('[useAuth] 💥 Error setup:', err.message);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] 🔄 Cambio auth:', event, session?.user?.id || 'null');
        if (session?.user?.id) {
          await fetchUserData(session.user.id);
        } else {
          clearUser();
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserData, clearUser]);
}

