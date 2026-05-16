import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useUserStore } from '@/store/useUserStore';
import {
  crearPostComunidad,
  eliminarPostComunidad,
  obtenerPostsComunidad,
} from '@/lib/comunidad';

type ComunidadPost = {
  id: string;
  nombre: string;
  texto: string;
  fechaISO: string;
};

function isoToFechaSimple(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function ComunidadScreen() {
  const router = useRouter();

  const nombre = useUserStore((state) => state.nombre) || 'Usuario';
  const userId = useUserStore((state) => state.userId);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const [texto, setTexto] = useState('');
  const [posts, setPosts] = useState<ComunidadPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoPublicacion, setCargandoPublicacion] = useState(false);

  const puedePublicar = useMemo(() => {
    if (!isAuthenticated || !userId) return false;
    return texto.trim().length > 0 && !cargandoPublicacion;
  }, [isAuthenticated, userId, texto, cargandoPublicacion]);

  const cargarMisPosts = async () => {
    if (!userId || !isAuthenticated) {
      setPosts([]);
      return;
    }

    try {
      setLoading(true);
      const data = await obtenerPostsComunidad(userId);
      // MVP: como todavía no traemos el nombre desde la tabla, usamos el nombre del store.
      setPosts(
        data.map((p) => ({
          id: p.id,
          nombre,
          texto: p.texto,
          fechaISO: p.created_at,
        }))
      );
    } catch (e) {
      console.error('Error cargando posts de comunidad:', e);
      Alert.alert(
        'Error',
        "No se pudieron cargar tus publicaciones. Verifica la tabla 'comunidad_posts' en Supabase."
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Cargar cuando haya sesión.
    cargarMisPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isAuthenticated]);

  const onPublicar = async () => {
    if (!puedePublicar || !userId) return;

    const textoTrim = texto.trim();
    if (!textoTrim) return;

    try {
      setCargandoPublicacion(true);

      // Optimistic UI simple: añadimos local temporalmente.
      const temp: ComunidadPost = {
        id: `local-${Date.now()}`,
        nombre,
        texto: textoTrim,
        fechaISO: new Date().toISOString(),
      };
      setPosts((prev) => [temp, ...prev]);
      setTexto('');

      const creado = await crearPostComunidad(userId, textoTrim);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === temp.id
            ? { id: creado.id, nombre, texto: creado.texto, fechaISO: creado.created_at }
            : p
        )
      );
    } catch (e) {
      console.error('Error publicando comunidad:', e);
      Alert.alert('Error', 'No se pudo publicar tu mensaje.');
      // Si falló, recargamos para corregir el estado.
      await cargarMisPosts();
    } finally {
      setCargandoPublicacion(false);
    }
  };

  const onEliminar = async (postId: string) => {
    if (!userId) return;

    Alert.alert('Eliminar publicación', '¿Seguro que deseas eliminar esta publicación?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            // Optimistic: quitar de la UI primero
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            await eliminarPostComunidad(userId, postId);
          } catch (e) {
            console.error('Error eliminando post:', e);
            Alert.alert('Error', 'No se pudo eliminar la publicación.');
            await cargarMisPosts();
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comunidad</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>Conecta con otros usuarios</Text>
        </View>

        <View style={styles.composer}>
          <Text style={styles.composerTitle}>¿Qué quieres compartir?</Text>

          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder={isAuthenticated ? 'Escribe un mensaje...' : 'Inicia sesión para publicar'}
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            multiline
            textAlignVertical="top"
            editable={!!(isAuthenticated && userId)}
          />

          <TouchableOpacity
            style={[styles.publishButton, { opacity: puedePublicar ? 1 : 0.55 }]}
            onPress={onPublicar}
            disabled={!puedePublicar}
            activeOpacity={0.8}
          >
            {cargandoPublicacion ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.publishButtonText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.feed}>
          <Text style={styles.feedTitle}>Mis publicaciones</Text>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#9183AF" />
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Todavía no hay publicaciones.</Text>
            </View>
          ) : (
            posts.map((p) => (
              <View key={p.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Text style={styles.postName}>{p.nombre}</Text>
                  <Text style={styles.postDate}>{isoToFechaSimple(p.fechaISO)}</Text>
                </View>

                <Text style={styles.postText}>{p.texto}</Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onEliminar(p.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  safeHeader: {
    backgroundColor: '#f8f9fb',
  },
  header: {
    height: 120,
    backgroundColor: '#9183af',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileIcon: {
    fontSize: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  composer: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  composerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    minHeight: 92,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  publishButton: {
    backgroundColor: '#9183af',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  feed: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  postDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  postText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 10,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
});

