import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { supabase } from '../lib/supabase'; 
import { useRouter } from 'expo-router'; // Importamos el hook

export default function RegistroScreen() {
  const router = useRouter(); // <--- DECLARACIÓN DENTRO DE LA FUNCIÓN
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !nombre) {
      Alert.alert("Error", "Rellena todos los campos");
      return;
    }

    setLoading(true);
    
    // 1. Crear usuario en Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      Alert.alert("Error", authError.message);
    } else if (user) {
      // 2. Insertar en tabla pública para la tarea (JSONB)
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert([
          { 
            id: user.id, 
            nombre: nombre,
            metas_mascota: { nombre: "Mindy", nivel: 1, hambre: 100 } 
          }
        ]);

      if (dbError) {
        Alert.alert("Error DB", dbError.message);
      } else {
        Alert.alert("¡Éxito!", "Usuario creado en la base de datos", [
          { text: "OK", onPress: () => router.replace('/auth') } // Usa el router aquí
        ]);
      }
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Registro MindPet</Text>
        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Crear Cuenta'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {flex: 1, justifyContent: 'center', padding: 25 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#9183af' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 10 },
  button: { backgroundColor: '#9183af', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});