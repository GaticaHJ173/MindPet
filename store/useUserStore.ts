import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserState {
  userId: string | null;
  nombre: string;
  email: string | null;
  bienestarScore: number;
  mascota: any;
  loading: boolean;
  fetchUserData: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  nombre: '',
  email: null,
  bienestarScore: 0,
  mascota: {},
  loading: false,

  fetchUserData: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('nombre, email, bienestar_score, metas_mascota')
        .eq('id', userId)
        .single();

      if (data) {
        set({
          userId,
          nombre: data.nombre,
          email: data.email,
          bienestarScore: data.bienestar_score,
          mascota: data.metas_mascota,
          loading: false,
        });
      } else if (error) {
        console.log('Error fetching user:', error);
        set({ loading: false });
      }
    } catch (err) {
      console.log('Error:', err);
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        userId: null,
        nombre: '',
        email: null,
        bienestarScore: 0,
        mascota: {},
      });
    } catch (err) {
      console.log('Error logout:', err);
    }
  },

  clearUser: () => {
    set({
      userId: null,
      nombre: '',
      email: null,
      bienestarScore: 0,
      mascota: {},
    });
  },
}));