import { supabase } from './supabase';
import { useUserStore } from '@/store/useUserStore';

export interface Habito {
  id?: string;
  usuario_id?: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  completado: boolean;
  fecha_inicio?: string;
}

// Guardar un nuevo hábito
export async function guardarHabito(habito: Habito) {
  const { id: usuarioId } = useUserStore.getState();
  
  if (!usuarioId) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('habitos')
    .insert({
      usuario_id: usuarioId,
      nombre: habito.nombre,
      descripcion: habito.descripcion,
      icono: habito.icono,
      color: habito.color,
      completado: habito.completado,
      fecha_inicio: habito.fecha_inicio || new Date().toISOString().split('T')[0],
    })
    .select();

  if (error) throw error;
  return data;
}

// Obtener hábitos del usuario
export async function obtenerHabitos() {
  const { id: usuarioId } = useUserStore.getState();

  if (!usuarioId) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('habitos')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw error;
  return data;
}

// Actualizar estado de un hábito
export async function actualizarHabito(habitoId: string, completado: boolean) {
  const { data, error } = await supabase
    .from('habitos')
    .update({ completado, updated_at: new Date().toISOString() })
    .eq('id', habitoId)
    .select();

  if (error) throw error;
  return data;
}

// Eliminar un hábito
export async function eliminarHabito(habitoId: string) {
  const { error } = await supabase
    .from('habitos')
    .delete()
    .eq('id', habitoId);

  if (error) throw error;
}
