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
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { obtenerHabitos, actualizarHabito } from '@/lib/habitos';

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
  const [error, setError] = useState<string | null>(null);

  // Cargar hábitos desde Supabase al iniciar
  useEffect(() => {
    cargarHabitos();
  }, []);

  const cargarHabitos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerHabitos();
      setHabitos(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar hábitos');
      Alert.alert('Error', 'No se pudieron cargar los hábitos');
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
      <ScrollView showsVerticalScrollIndicator={false}>
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

        {/* Lista de Hábitos */}
        {habitos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tienes hábitos registrados</Text>
            <Text style={styles.emptyStateSubtext}>
              Próximamente podrás agregar tus propios hábitos
            </Text>
          </View>
        ) : (
          <View style={styles.habitosSection}>
            <Text style={styles.sectionTitle}>Tus Hábitos Diarios</Text>
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
    overflow: 'hidden',
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
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});
