import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useAuth();

  useEffect(() => {
    console.log('[LAYOUT] 🚀 Layout mounted');

    const getSession = async () => {
      try {
        console.log('[AUTH] 🔍 Fetching session from storage...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log('[AUTH] 📱 Session:', session?.user ? `${session.user.id} (${session.user.email})` : 'NO SESSION');
if (session?.access_token && Date.parse(session.expires_at) < Date.now()) {
          console.log('[AUTH] ⚠️ Token expired, signing out');
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(session);
        }
      } catch (err) {
        console.error('[AUTH] 💥 Session error:', err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      console.log('[AUTH] 🔄 Event:', event, 'user:', s?.user?.id || null);
      setSession(s);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9183af" />
      </View>
    );
  }

  const showTabs = !!session?.user;
  console.log('[LAYOUT] 🎯 Show tabs:', showTabs);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {showTabs ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="auth" />
      )}
    </Stack>
  );
}

