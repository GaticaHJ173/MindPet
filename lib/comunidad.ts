import { supabase } from '@/lib/supabase';

export type ComunidadPostDB = {
  id: string;
  user_id: string;
  texto: string;
  created_at: string;
};

// MVP: crear tablas mínimas requiere que exista en Supabase.
// - comunidad_posts (id uuid pk, user_id uuid, texto text, created_at timestamptz default now())

export async function obtenerPostsComunidad(userId: string) {
  const { data, error } = await supabase
    .from('comunidad_posts')
    .select('id, user_id, texto, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ComunidadPostDB[];
}

export async function crearPostComunidad(userId: string, texto: string) {
  const { data, error } = await supabase
    .from('comunidad_posts')
    .insert({ user_id: userId, texto })
    .select('id, user_id, texto, created_at')
    .single();

  if (error) throw error;
  return data as ComunidadPostDB;
}

export async function eliminarPostComunidad(userId: string, postId: string) {
  const { error } = await supabase
    .from('comunidad_posts')
    .delete()
    .eq('user_id', userId)
    .eq('id', postId);

  if (error) throw error;
}

