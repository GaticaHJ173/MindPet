import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DiarioEmocionalScreen() {
  const router = useRouter();
  const [sentimientos, setSentimientos] = useState<string[]>([]);
  const [nota, setNota] = useState('');

  const emociones = [
    { emoji: '😊', nombre: 'Feliz', color: '#FFE66D' },
    { emoji: '😌', nombre: 'Tranquilo', color: '#95E1D3' },
    { emoji: '😢', nombre: 'Triste', color: '#6C9BC4' },
    { emoji: '😤', nombre: 'Frustrado', color: '#FF6B6B' },
    { emoji: '😰', nombre: 'Ansioso', color: '#F4A460' },
    { emoji: '😍', nombre: 'Enamorado', color: '#FF69B4' },
  ];

  const toggleEmocion = (nombre: string) => {
    setSentimientos((prev) => {
      if (prev.includes(nombre)) {
        return prev.filter((e) => e !== nombre);
      } else {
        return [...prev, nombre];
      }
    });
  };

  const handleGuardar = () => {
    if (sentimientos.length === 0 || !nota.trim()) {
      Alert.alert('Error', 'Selecciona una emoción y escribe una nota');
      return;
    }
    Alert.alert('¡Perfecto!', 'Tu entrada al diario ha sido guardada');
    setSentimientos([]);
    setNota('');
  };

  return (
    <View style={styles.container}>
      {/* Header protegido con SafeAreaView */}
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

      {/* Contenido en ScrollView */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Subencabezado */}
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>Hoy es un buen día para expresarte</Text>
        </View>

        {/* Emociones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cómo te sientes hoy?</Text>
          <View style={styles.emocionesGrid}>
            {emociones.map((emocion) => (
              <TouchableOpacity
                key={emocion.nombre}
                style={[
                  styles.emocionCard,
                  { backgroundColor: emocion.color },
                  sentimientos.includes(emocion.nombre) && styles.emocionCardSelected,
                ]}
                onPress={() => toggleEmocion(emocion.nombre)}
              >
                <Text style={styles.emocionEmoji}>{emocion.emoji}</Text>
                <Text style={styles.emocionNombre}>{emocion.nombre}</Text>
                {sentimientos.includes(emocion.nombre) && (
                  <MaterialIcons name="check-circle" size={20} color="#fff" style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nota */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuéntanos más</Text>
          <TextInput
            style={styles.textArea}
            placeholder="¿Qué te pasó hoy? ¿Qué te hizo sentir así?"
            value={nota}
            onChangeText={setNota}
            multiline
            numberOfLines={5}
            placeholderTextColor="#ccc"
          />
        </View>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.guardarButton} onPress={handleGuardar}>
          <MaterialIcons name="save" size={24} color="#fff" />
          <Text style={styles.guardarButtonText}>Guardar en mi diario</Text>
        </TouchableOpacity>

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
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  emocionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emocionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    opacity: 0.7,
  },
  emocionCardSelected: {
    opacity: 1,
    borderWidth: 3,
    borderColor: '#fff',
  },
  emocionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emocionNombre: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  guardarButton: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#9183af',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  guardarButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
