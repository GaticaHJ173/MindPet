import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa auth y carga datos del usuario
  useAuth();

  useEffect(() => {
    // 1. Obtén la sesión actual
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.log('Error getting session:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 2. Setup listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        setSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9183af" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session?.user ? (
        // USUARIO LOGUEADO → Muestra tabs
        <Stack.Screen name="(tabs)" />
      ) : (
        // SIN LOGIN → Muestra auth (login/registro)
        <Stack.Screen name="auth" />
      )}
    </Stack>
  );
}