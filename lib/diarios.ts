import { supabase } from './supabase';
import { useUserStore } from '../store/useUserStore';

export interface DiarioEntry {
  id?: string;
  user_id: string;
  fecha: string;
  emociones: string[];
  nota: string;
  created_at?: string;
}

// Guardar nueva entrada de diario
export async function guardarDiario(entry: Omit<DiarioEntry, 'id' | 'created_at' | 'user_id'>) {
  const userStore = useUserStore.getState();
  const usuarioId = userStore.userId;
  
  if (!usuarioId) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('diarios')
    .insert({
      ...entry,
      user_id: usuarioId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Obtener entradas de diario del usuario
export async function obtenerDiarios() {
  const userStore = useUserStore.getState();
  const usuarioId = userStore.userId;

  if (!usuarioId) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('diarios')
    .select('*')
    .eq('user_id', usuarioId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Eliminar entrada de diario
export async function eliminarDiario(diarioId: string) {
  const { error } = await supabase
    .from('diarios')
    .delete()
    .eq('id', diarioId);

  if (error) throw error;
}

// Actualizar entrada de diario
export async function actualizarDiario(diarioId: string, data: Partial<DiarioEntry>) {
  const { data: updated, error } = await supabase
    .from('diarios')
    .update(data)
    .eq('id', diarioId)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

