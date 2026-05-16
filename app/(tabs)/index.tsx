
import {
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect } from 'react';


import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { MaterialIcons } from '@expo/vector-icons';
import { obtenerHabitos } from '@/lib/habitos';
import { useHabitosStatsStore } from '@/store/habitosStatsStore';





export default function HomeScreen() {
  const [habitosStats, setHabitosStats] = useState({ total: 0, completados: 0, porcentaje: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const nombre = useUserStore((state) => state.nombre) || 'Usuario';
  const userId = useUserStore((state) => state.userId);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const router = useRouter();

  const loadHabitosStats = async () => {
    try {
      setLoadingStats(true);
      const habitos = await obtenerHabitos();
      const total = habitos.length;
      const completados = habitos.filter((h) => h.completado).length;
      const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
      setHabitosStats({ total, completados, porcentaje });
    } catch (error) {
      console.error('Error loading hábitos:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const version = useHabitosStatsStore((s) => s.version);

  useEffect(() => {
    if (!userId || !isAuthenticated) {
      setLoadingStats(false);
      return;
    }
    loadHabitosStats();
  }, [userId, isAuthenticated, version]);


  const menuItems = [
    { title: 'Diario', icon: 'event-note', color: '#FF6B6B', route: '/(tabs)/diario' },
    { title: 'Mascota', icon: 'pets', color: '#4ECDC4', route: '/(tabs)/mascota' },
    { title: 'Hábitos', icon: 'check-circle', color: '#FFE66D', route: '/(tabs)/habitos' },
    { title: 'Comunidad', icon: 'group', color: '#95E1D3', route: '/(tabs)/comunidad' },
  ];

  const renderIcon = (item) => (
    <MaterialIcons name={item.icon} size={52} color="#fff" />
  );

  return (
    <View style={styles.container}>
      {/* Header intacto */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inicio</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>¡Hola, {nombre}!</Text>
          <Text style={styles.welcomeSubtitle}>Elige qué hacer hoy</Text>
        </View>

        {/* Grid 2x2 optimizado */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                {renderIcon(item)}
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats hábitos */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Progreso Hábitos</Text>
          {(!userId || !isAuthenticated) ? (
            <Text style={styles.statsPercentage}>Iniciando...</Text>
          ) : loadingStats ? (
            <ActivityIndicator size="small" color="#9183AF" />
          ) : (
            <View>
              <Text style={styles.statsValue}>{habitosStats.completados}/{habitosStats.total}</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${habitosStats.porcentaje}%` }]} />
              </View>
              <Text style={styles.statsPercentage}>{habitosStats.porcentaje}%</Text>
            </View>
          )}
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/(tabs)/diario')} activeOpacity={0.8}>
          <MaterialIcons name="edit" size={24} color="#fff" />
          <Text style={styles.ctaText}>Empezar Diario Hoy</Text>
        </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 12,
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
  welcomeSection: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  welcomeGreeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 8,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9183AF',
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  statsPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#9183AF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
});
