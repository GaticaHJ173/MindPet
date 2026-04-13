import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

export function useAuth() {
  const { fetchUserData, clearUser } = useUserStore();

  useEffect(() => {
    // Obtén la sesión actual y carga datos del usuario
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await fetchUserData(session.user.id);
        }
      } catch (err: any) {
        console.log('Error in setupAuth:', err);
      }
    };

    setupAuth();

    // Escucha cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: any) => {
        if (session?.user?.id) {
          // Usuario inicia sesión
          await fetchUserData(session.user.id);
        } else {
          // Usuario cierra sesión
          clearUser();
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserData, clearUser]);
}
