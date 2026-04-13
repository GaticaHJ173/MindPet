import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://kooqtgzqtlzylgkbmbbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvb3F0Z3pxdGx6eWxna2JtYmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjIwNTEsImV4cCI6MjA4OTg5ODA1MX0.XbIn-Z0wyG6qJF6qYfScks30KxrIVEN7rl5DI32QT-M';

// Esta variable detecta si estamos en el "servidor" o en el "cliente"
const isWeb = Platform.OS === 'web';
const isServer = typeof window === 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Si es servidor, no usamos storage para evitar el error 'window is not defined'
    storage: isServer ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});