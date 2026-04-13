# Ejemplos de Uso - Accediendo al Usuario 👤

## Ejemplo 1: Mostrar el Nombre del Usuario en Tabs

En tu archivo `app/(tabs)/index.tsx` (o cualquier tab):

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/useUserStore';

export default function HomeTab() {
  const { nombre, loading } = useUserStore();

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola, {nombre}!</Text>
      <Text>Bienvenido a MindPet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
```

---

## Ejemplo 2: Mostrar Datos de la Mascota

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useUserStore } from '@/store/useUserStore';

export default function MascotaTab() {
  const { mascota, nombre } = useUserStore();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Mi Mascota: {mascota?.nombre || 'Mindy'}
      </Text>
      <Text>Dueño: {nombre}</Text>
      <Text>Nivel: {mascota?.nivel || 1}</Text>
      <Text>Hambre: {mascota?.hambre || 100}/100</Text>
    </View>
  );
}
```

---

## Ejemplo 3: Boton de Cerrar Sesión

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useUserStore } from '@/store/useUserStore';

export default function LogoutButton() {
  const { logout } = useUserStore();

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            await logout();
            // La navegación se actualiza automáticamente
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.buttonText}>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#ff3b30', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
```

---

## Ejemplo 4: Actualizar Datos de Mascota

Para actualizar el estado de la mascota, necesitas:

1. **Actualizar en Supabase:**
```typescript
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';

async function updateMascota(nuevosDatos: any) {
  const { userId } = useUserStore.getState(); // Obtén el ID del usuario
  
  const { error } = await supabase
    .from('usuarios')
    .update({ 
      metas_mascota: nuevosDatos 
    })
    .eq('id', userId);

  if (!error) {
    // Recarga los datos del usuario para actualizar el UI
    await useUserStore.getState().fetchUserData(userId);
  }
}

// Uso:
updateMascota({ nombre: 'Mindy', nivel: 2, hambre: 80 });
```

---

## Ejemplo 5: Usar `useAuth()` en una Pantalla Personalizada

Si necesitas cargar datos en una pantalla específica:

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/useUserStore';

export default function PerfilScreen() {
  // Esto asegura que los datos estén cargados
  useAuth();

  const { nombre, email, loading } = useUserStore();

  if (loading) return <Text>Cargando perfil...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{nombre}</Text>
      <Text>{email}</Text>
    </View>
  );
}
```

---

## Resumen de Imports Comunes

```typescript
// Para acceder a datos del usuario:
import { useUserStore } from '@/store/useUserStore';

// Para inicializar autenticación:
import { useAuth } from '@/hooks/useAuth';

// Para acceder a Supabase directamente:
import { supabase } from '@/lib/supabase';
```

---

## ¿Necesitas Más Ejemplos?

Los patrones son:
1. **Leer datos** → `const { nombre, mascota } = useUserStore();`
2. **Escribir datos** → Usar `supabase.from('usuarios').update()` luego llamar `fetchUserData()`
3. **Cerrar sesión** → `const { logout } = useUserStore(); await logout();`
