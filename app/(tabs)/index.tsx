import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { FontAwesome, MaterialIcons, Ionicons, Fontisto } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const { nombre } = useUserStore();

  const menuItems = [
    {
      title: 'Diario Emocional',
      description: 'Registra cómo te sientes',
      icon: 'event-note',
      color: '#FF6B6B',
      route: '/(tabs)/diario',
      iconType: 'material',
    },
    {
      title: 'Mi Mascota',
      description: 'Cuida a tu compañero digital',
      icon: 'pets',
      color: '#4ECDC4',
      route: '/(tabs)/mascota',
      iconType: 'material',
    },
    {
      title: 'Mis Hábitos',
      description: 'Mejora tu rutina diaria',
      icon: 'check',
      color: '#FFE66D',
      route: '/(tabs)/habitos',
      iconType: 'fontisto',
    },
    {
      title: 'Comunidad',
      description: 'Conecta con otros usuarios',
      icon: 'group',
      color: '#95E1D3',
      route: '/(tabs)/comunidad',
      iconType: 'font-awesome',
    },
    {
      title: 'Mi Perfil',
      description: 'Gestiona tu cuenta',
      icon: 'person',
      color: '#A8E6CF',
      route: '/(tabs)/perfil',
      iconType: 'ionicons',
    },
  ];

  const renderIcon = (item: any) => {
    switch (item.iconType) {
      case 'material':
        return <MaterialIcons name={item.icon} size={40} color="#fff" />;
      case 'fontisto':
        return <Fontisto name={item.icon} size={32} color="#fff" />;
      case 'font-awesome':
        return <FontAwesome name={item.icon} size={40} color="#fff" />;
      case 'ionicons':
        return <Ionicons name={item.icon} size={40} color="#fff" />;
      default:
        return <MaterialIcons name={item.icon} size={40} color="#fff" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header protegido con SafeAreaView */}
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

      {/* Contenido en ScrollView */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>¡Hola, {nombre || 'Usuario'}!</Text>
          <Text style={styles.welcomeSubtitle}>Hoy es un buen día para cuidarte</Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                {renderIcon(item)}
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats or motivational section */}
        <View style={styles.motivationalSection}>
          <Text style={styles.motivationalTitle}>Te estamos esperando</Text>
          <Text style={styles.motivationalText}>
            Cada acción cuenta. Sigue adelante con tu bienestar y ayuda a tu mascota digital a crecer.
          </Text>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    height: 60,
    backgroundColor: '#9183af',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeGreeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  menuGrid: {
    paddingHorizontal: 12,
    marginBottom: 30,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  motivationalSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#9183af',
    borderRadius: 16,
  },
  motivationalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});

