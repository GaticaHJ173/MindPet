  import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { obtenerHabitos, actualizarHabito, guardarHabito, eliminarHabito } from '@/lib/habitos';

interface Habito {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  completado: boolean;
}

export default function HabitosScreen() {
  const router = useRouter();
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: 'water',
    color: '#4ECDC4',
  });

  // Cargar hábitos desde Supabase al iniciar
  useEffect(() => {
    cargarHabitos();
  }, []);

  // Agregar nuevo hábito
  const agregarHabito = async () => {
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      Alert.alert('Error', 'Nombre y descripción son requeridos');
      return;
    }

    try {
      setLoading(true);
      await guardarHabito({
        ...formData,
        completado: false,
      } as any);
      setFormData({ nombre: '', descripcion: '', icono: 'water', color: '#4ECDC4' });
      setShowForm(false);
      await cargarHabitos();
      Alert.alert('Éxito', 'Hábito agregado correctamente');
    } catch (err: any) {
      Alert.alert('Error', 'No se pudo agregar el hábito');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar hábito
  const handleEliminarHabito = (id: string) => {
    Alert.alert(
      'Eliminar hábito',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarHabito(id);
              setHabitos(habitos.filter((h) => h.id !== id));
            } catch (err: any) {
              Alert.alert('Error', 'No se pudo eliminar el hábito');
            }
          },
        },
      ]
    );
  };

  // Refresh list
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarHabitos();
    setRefreshing(false);
  };

  const cargarHabitos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerHabitos();
      setHabitos(data || []);
    } catch (err: any) {
      console.error('Error hábitos:', err);
      setError(err.message || 'Error al cargar hábitos');
      // No mostrar Alert cada vez - solo log para debug
    } finally {
      setLoading(false);
    }
  };

  // Actualizar hábito en BD
  const toggleHabito = async (id: string) => {
    try {
      const habito = habitos.find((h) => h.id === id);
      if (!habito) return;

      // Actualizar en estado local primero (UX mejor)
      setHabitos((prev) =>
        prev.map((h) => (h.id === id ? { ...h, completado: !h.completado } : h))
      );

      // Actualizar en BD
      await actualizarHabito(id, !habito.completado);
    } catch (err: any) {
      // Revertir cambio si hay error
      setHabitos((prev) =>
        prev.map((h) => (h.id === id ? { ...h, completado: !h.completado } : h))
      );
      Alert.alert('Error', 'No se pudo actualizar el hábito');
    }
  };

  const completados = habitos.filter((h) => h.completado).length;
  const porcentaje = habitos.length > 0 ? Math.round((completados / habitos.length) * 100) : 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeHeader}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Hábitos</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#9183af" />
          <Text style={styles.loadingText}>Cargando tus hábitos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header protegido con SafeAreaView */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hábitos</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Contenido en ScrollView */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#9183af" />
        }
      >
        {/* Subencabezado */}
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>Construye mejores rutinas</Text>
        </View>

        {/* Progreso */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <View style={styles.circuloProgreso}>
              <Text style={styles.porcentajeText}>{porcentaje}%</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Hoy has completado:</Text>
              <Text style={styles.progressValue}>
                {completados} de {habitos.length} hábitos
              </Text>
            </View>
          </View>
        </View>

        {/* Botón Agregar Hábito */}
        <TouchableOpacity 
          style={styles.agregarButton} 
          onPress={() => setShowForm(!showForm)}
          activeOpacity={0.7}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.agregarButtonText}>
            {showForm ? 'Cancelar' : 'Agregar Nuevo Hábito'}
          </Text>
        </TouchableOpacity>

        {/* Formulario de Registro */}
        {showForm && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Nuevo Hábito</Text>
            
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Nombre del hábito (ej: Beber agua)"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción (ej: 2 litros al día)"
                value={formData.descripcion}
                onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                placeholderTextColor="#999"
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Iconos */}
            <Text style={styles.label}>Icono:</Text>
            <View style={styles.iconRow}>
              {[
                { name: 'water', icon: 'water' },
                { name: 'bed', icon: 'bed' },
                { name: 'run', icon: 'run' },
                { name: 'apple', icon: 'apple' },
                { name: 'book', icon: 'book-open' },
                { name: 'meditation', icon: 'yoga' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.iconButton,
                    formData.icono === item.icon && styles.iconButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, icono: item.icon })}
                >
                  <MaterialCommunityIcons name={item.icon as any} size={24} color="#fff" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Colores */}
            <Text style={styles.label}>Color:</Text>
            <View style={styles.colorRow}>
              {[
                '#4ECDC4', '#FF6B6B', '#FFE66D', '#95E1D3', '#A8E6CF', '#9183AF'
              ].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    formData.color === color && styles.colorButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, color })}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.guardarButton} onPress={agregarHabito}>
              <Text style={styles.guardarButtonText}>Guardar Hábito</Text>
            </TouchableOpacity>
          </View>
        )}


        {/* Lista de Hábitos Registrados */}
        {habitos.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="plus-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No tienes hábitos registrados</Text>
            <Text style={styles.emptyStateSubtext}>
              Toca el botón + para agregar tu primer hábito diario
            </Text>
          </View>
        ) : (
          <View style={styles.habitosSection}>
            <Text style={styles.sectionTitle}>Hábitos Registrados</Text>
            {habitos.map((habito) => (
              <View
                key={habito.id}
                style={[styles.habitoCard, habito.completado && styles.habitoCardCompleted]}
              >
                <TouchableOpacity
                  style={styles.habitoContent}
                  onPress={() => toggleHabito(habito.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconoContainer,
                      { backgroundColor: habito.color },
                      habito.completado && styles.iconoContainerCompleted,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={habito.icono as any}
                      size={28}
                      color="#fff"
                    />
                  </View>

                  <View style={styles.habitoTextos}>
                    <Text
                      style={[
                        styles.habitoNombre,
                        habito.completado && styles.habitoNombreCompleted,
                      ]}
                    >
                      {habito.nombre}
                    </Text>
                    <Text style={styles.habitoDescripcion}>{habito.descripcion}</Text>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: habito.completado ? '#9183af' : 'transparent',
                          borderColor: habito.completado ? '#9183af' : '#ddd',
                        },
                      ]}
                    >
                      {habito.completado && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#fff"
                          style={{ alignSelf: 'center', marginTop: 4 }}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Botón Eliminar */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleEliminarHabito(habito.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
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
  subtitle: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  circuloProgreso: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9183af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  porcentajeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  agregarButton: {
    flexDirection: 'row',
    backgroundColor: '#9183af',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agregarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  iconButtonSelected: {
    backgroundColor: '#9183af',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  colorButtonSelected: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  guardarButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guardarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  habitosSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  habitoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  habitoCardCompleted: {
    backgroundColor: '#f0f0f0',
  },
  habitoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconoContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconoContainerCompleted: {
    opacity: 0.6,
  },
  habitoTextos: {
    flex: 1,
  },
  habitoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  habitoNombreCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  habitoDescripcion: {
    fontSize: 13,
    color: '#999',
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
