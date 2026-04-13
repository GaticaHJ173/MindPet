# Resumen de Cambios - Autenticación MindPet 🔄

## ✅ Cambios Realizados

### 1. **`app/_layout.tsx`** (Raíz de navegación)
**Cambios:**
- ✅ Agregado listener automático de sesión con `onAuthStateChanged`
- ✅ Hook `useAuth()` para cargar datos del usuario automáticamente
- ✅ Flujo simplificado: Si hay sesión → tabs, Si no → auth
- ✅ Eliminada referencia a pantalla `registro` (ahora todo en `auth`)

**Beneficio:** La app responde automáticamente a cambios de sesión

### 2. **`app/auth.tsx`** (Pantalla de Login/Registro)
**Cambios:**
- ✅ Pantalla unificada con toggle entre login y registro
- ✅ Mejor validación (contraseña mín 6 caracteres)
- ✅ Manejo de errores mejorado
- ✅ UI mejorada con estilos consistentes
- ✅ El registro ahora inserta automáticamente en tabla `usuarios`
- ✅ La sesión se actualiza automáticamente (no necesita navegar manualmente)

**Beneficio:** Una única pantalla limpia y funcional

### 3. **`store/useUserStore.ts`** (Estado global con Zustand)
**Cambios:**
- ✅ Agregado campo `userId` para identificar usuario actual
- ✅ Agregado campo `email`
- ✅ Método `logout()` para desconectar con `supabase.auth.signOut()`
- ✅ Método `clearUser()` para limpiar estado cuando se logueout

**Beneficio:** Control completo del estado de usuario en toda la app

### 4. **`hooks/useAuth.ts`** (NUEVO - Hook Personalizado)
**Qué hace:**
- Escucha cambios de sesión automáticamente
- Carga datos del usuario cuando inicia sesión
- Limpia datos cuando cierra sesión
- Usa automáticamente el `useUserStore`

**Beneficio:** Se usa con una simple línea: `useAuth()`

---

## 🚀 Cómo Usar Ahora

### Flujo de usuario:
1. **Usuario abre app** → ve pantalla de login/registro
2. **Usuario se registra** → datos se guardan en Supabase automáticamente
3. **Usuario inicia sesión** → se cargan sus datos del perfil
4. **Usuario ves tabs** → accede a todas las funcionalidades

### En tus otras pantallas (tabs):
Para acceder a datos del usuario:
```typescript
import { useUserStore } from '@/store/useUserStore';

const { nombre, email, mascota, logout } = useUserStore();

// Para cerrar sesión:
const handleLogout = async () => {
  await logout();
};
```

---

## 📝 Requisitos en Supabase

Asegúrate que en tu base de datos exista:
- ✅ Tabla `usuarios` con columnas: `id`, `nombre`, `email`, `bienestar_score`, `metas_mascota`
- ✅ RLS habilitado con políticas para lectura/escritura propias

Ver archivo `SUPABASE_SETUP.md` para instrucciones detalladas.

---

## 🧪 Cómo Probar

1. Ejecuta: `npm start` o `expo start`
2. Abre la app en tu dispositivo/emulador
3. **Prueba el Registro:**
   - Nombre: "Juan"
   - Email: "juan@example.com"
   - Contraseña: "password123"
   - Verifica en Supabase que aparece el usuario en tabla `usuarios`
4. **Prueba el Login:**
   - Usa las mismas credenciales
   - Deberías ver los tabs

---

## ⚠️ Si Algo No Funciona

### El usuario se registra pero NO aparece en la tabla:
- Revisa RLS policies en Supabase (probablemente denegar insert)
- Desactiva RLS temporalmente para testear
- Revisa consola de la app para ver errores

### El usuario se registra pero redirige a login:
- Normal, tienes que loguear después del registro (flujo de Supabase)
- Para auto-loginear después del registro, modifica `auth.tsx`

### El usuario logueado pero no ve los tabs:
- Revisa que la tabla `(tabs)/_layout.tsx` esté creada
- Verifica los Logs de Supabase en dashboard

---

## 🔄 Siguientes Pasos

1. ✅ **Completado:** Autenticación funcional
2. ⏳ **Siguiente:** Asegura RLS en Supabase
3. ⏳ **Las pantallas de tabs** - trabajaremos en personalizarlas con datos de usuario
