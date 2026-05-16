import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const { nombre, email } = useUserStore();

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
      {
        text: 'Cerrar sesión',
        onPress: async () => {
          try {
            await supabase.auth.signOut();
            useUserStore.getState().clearUser();
            router.replace('/auth');
          } catch (e) {
            Alert.alert('Error', 'No se pudo cerrar la sesión');
          }

        },
        style: 'destructive',
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'person',
      title: 'Información Personal',
      description: 'Ver y editar mi perfil',
      onPress: () => Alert.alert('Info', 'Próximamente'),
    },
    {
      icon: 'notifications',
      title: 'Notificaciones',
      description: 'Configurar alertas',
      onPress: () => Alert.alert('Info', 'Próximamente'),
    },
    {
      icon: 'lock',
      title: 'Seguridad',
      description: 'Cambiar contraseña',
      onPress: () => Alert.alert('Info', 'Próximamente'),
    },
    {
      icon: 'help',
      title: 'Ayuda y Soporte',
      description: 'Preguntas frecuentes',
      onPress: () => Alert.alert('Info', 'Próximamente'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header protegido con SafeAreaView */}
      <SafeAreaView style={styles.safeHeader}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Perfil</Text>
            <View style={styles.profileIconPlaceholder} />
          </View>

      </SafeAreaView>

      {/* Contenido en ScrollView */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Tarjeta de Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#9183af" />
          </View>

          <Text style={styles.profileName}>{nombre || 'Usuario'}</Text>
          <Text style={styles.profileEmail}>{email || 'email@ejemplo.com'}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>7</Text>
              <Text style={styles.statLabel}>Días Activo</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Hábitos</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon as any} size={24} color="#9183af" />
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  safeHeader: {
    backgroundColor: '#f6f7fb',
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
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  profileIconPlaceholder: {
    width: 22,
  },
  subtitle: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  subtitleText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  profileCard: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef0f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#edf0f6',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#9183af',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  divider: {
    width: 1,
    backgroundColor: '#edf0f6',
  },
  menuSection: {
    marginHorizontal: 18,
    marginTop: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#eef0f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  logoutButton: {
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});

