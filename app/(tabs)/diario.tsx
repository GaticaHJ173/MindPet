import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { guardarDiario, obtenerDiarios, eliminarDiario, DiarioEntry } from '@/lib/diarios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const emociones = [
  { emoji: '😊', nombre: 'Feliz', color: '#FFE66D' },
  { emoji: '😌', nombre: 'Tranquilo', color: '#95E1D3' },
  { emoji: '😢', nombre: 'Triste', color: '#6C9BC4' },
  { emoji: '😤', nombre: 'Frustrado', color: '#FF6B6B' },
  { emoji: '😰', nombre: 'Ansioso', color: '#F4A460' },
  { emoji: '😍', nombre: 'Enamorado', color: '#FF69B4' },
];

export default function DiarioScreen() {
  const router = useRouter();
  const { userId, isAuthenticated, nombre } = useUserStore();
  const [activeTab, setActiveTab] = useState(0); // 0: Nueva, 1: Mis Diarios
  const [sentimientos, setSentimientos] = useState<string[]>([]);
  const [nota, setNota] = useState('');
  const [diarios, setDiarios] = useState<DiarioEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadDiarios = useCallback(async () => {
    if (!isAuthenticated || !userId) return;
    setLoading(true);
    try {
      const data = await obtenerDiarios();
      setDiarios(data);
    } catch (error: any) {
      Alert.alert('Error', `No se pudieron cargar los diarios. Si es tabla no encontrada, crea 'diarios' en Supabase:
CREATE TABLE diarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth.users(id),
  fecha TEXT NOT NULL,
  emociones TEXT[],
  nota TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const handleGuardar = async () => {
    if (sentimientos.length === 0 || !nota.trim()) {
      Alert.alert('Error', 'Selecciona al menos una emoción y escribe una nota');
      return;
    }
    if (!isAuthenticated || !userId) {
      Alert.alert('Login requerido', 'Inicia sesión para guardar diarios');
      router.push('/auth');
      return;
    }
    try {
      setLoading(true);
      const fechaHoy = format(new Date(), 'yyyy-MM-dd');
      await guardarDiario({ fecha: fechaHoy, emociones: sentimientos, nota: nota.trim() });
      Alert.alert('¡Guardado!', 'Tu entrada ha sido registrada en tu diario');
      setSentimientos([]);
      setNota('');
      if (activeTab === 1) loadDiarios();
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar entrada',
      '¿Estás seguro? No se puede deshacer.',
      [
        { text: 'Cancelar' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarDiario(id);
              setDiarios(prev => prev.filter(d => d.id !== id));
              Alert.alert('Eliminado', 'Entrada removida del diario');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDiarios().then(() => setRefreshing(false));
  }, [loadDiarios]);

  useEffect(() => {
    if (activeTab === 1) loadDiarios();
  }, [activeTab, loadDiarios]);

  useEffect(() => {
    loadDiarios();
  }, [isAuthenticated]);

  const renderEmocion = (item: typeof emociones[0]) => {
    const selected = sentimientos.includes(item.nombre);
    return (
      <TouchableOpacity
        style={[
          styles.emocionCard,
          { backgroundColor: item.color },
          selected && styles.emocionCardSelected,
        ]}
        onPress={() => setSentimientos(prev => 
          selected ? prev.filter(e => e !== item.nombre) : [...prev, item.nombre]
        )}
        activeOpacity={0.8}
      >
        <Text style={styles.emocionEmoji}>{item.emoji}</Text>
        <Text style={styles.emocionNombre}>{item.nombre}</Text>
        {selected && <MaterialIcons name="check" size={20} color="#fff" style={styles.checkmark} />}
      </TouchableOpacity>
    );
  };

  const renderDiarioItem = ({ item }: { item: DiarioEntry }) => (
    <View style={styles.diarioItem}>
      <Text style={styles.diarioFecha}>{format(new Date(item.fecha), 'PPP', { locale: es })}</Text>
      <View style={styles.emocionesPreview}>
        {item.emociones.map((emo, idx) => (
          <View key={idx} style={[styles.emojiPreview, { backgroundColor: emociones.find(e => e.nombre === emo)?.color || '#ccc' }]}>
            <Text style={styles.emojiPreviewText}>{emociones.find(e => e.nombre === emo)?.emoji}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.diarioNota} numberOfLines={3}>{item.nota}</Text>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id!)}>
        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeHeader}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Diario</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View style={styles.authMessage}>
          <MaterialIcons name="lock" size={64} color="#ccc" />
          <Text style={styles.authTitle}>Inicia sesión</Text>
          <Text style={styles.authSubtitle}>Accede a tu diario personal</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/auth')}>
            <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Diario {nombre}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 0 && styles.tabBtnActive]}
          onPress={() => setActiveTab(0)}
        >
          <MaterialIcons name="add" size={20} color={activeTab === 0 ? '#9183AF' : '#666'} />
          <Text style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}>Nueva Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 1 && styles.tabBtnActive]}
          onPress={() => setActiveTab(1)}
        >
          <MaterialIcons name="list" size={20} color={activeTab === 1 ? '#9183AF' : '#666'} />
          <Text style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}>Mis Diarios</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 0 ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
          >
            <View style={styles.subtitle}>
            <Text style={styles.subtitleText}>¿Cómo te sientes hoy, {nombre}?</Text>
          </View>
          <View style={styles.emocionesGrid}>
            {emociones.map(item => (
              <View key={item.nombre} style={{flexBasis: '48%', margin: 4}}>
                {renderEmocion(item)}
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuéntanos más</Text>
            <TextInput
              style={styles.textArea}
              placeholder="¿Qué te pasó hoy? ¿Qué pensamientos tienes?..."
              value={nota}
              onChangeText={setNota}
              multiline
              maxLength={1000}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={[styles.guardarButton, loading && styles.guardarButtonDisabled]} onPress={handleGuardar} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialIcons name="save" size={24} color="#fff" />
            )}
            <Text style={styles.guardarButtonText}>{loading ? 'Guardando...' : 'Guardar en mi diario'}</Text>
          </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <FlatList
          data={diarios}
          renderItem={renderDiarioItem}
          keyExtractor={(item) => item.id!}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="event-note" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No hay entradas aún</Text>
              <Text style={styles.emptySubtitle}>Crea tu primera entrada de diario</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setActiveTab(0)}>
                <Text style={styles.emptyBtnText}>+ Nueva Entrada</Text>
              </TouchableOpacity>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  tabBtnActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#9183af',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#9183af',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subtitleText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  emocionesGrid: {
    paddingHorizontal: 16,
  },
  emocionesList: {
    paddingBottom: 20,
  },
  emocionCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    opacity: 0.8,
  },
  emocionCardSelected: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  emocionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emocionNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guardarButton: {
    flexDirection: 'row',
    backgroundColor: '#9183af',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  guardarButtonDisabled: {
    opacity: 0.7,
  },
  guardarButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  diarioItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  diarioFecha: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9183af',
    marginBottom: 8,
  },
  emocionesPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  emojiPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiPreviewText: {
    fontSize: 20,
  },
  diarioNota: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  authMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  loginBtn: {
    backgroundColor: '#9183af',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: '#9183af',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
