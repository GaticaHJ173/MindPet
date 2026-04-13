# Checklist de Configuración Supabase 🔧

## 1. Tabla `usuarios` 
Asegúrate que existe con estas columnas:
- ✅ `id` (UUID, Primary Key, FDCC)
- ✅ `nombre` (text)
- ✅ `email` (text, opcional)
- ✅ `bienestar_score` (integer, default: 0)
- ✅ `metas_mascota` (jsonb, para guardar datos de la mascota)
- ✅ `created_at` (timestamp)

## 2. Políticas de Seguridad (RLS)
La tabla debe tener estas políticas activadas:

### Permitir lectura de perfil propio:
```sql
CREATE POLICY "Usuarios pueden ver su propio perfil"
ON usuario FOR SELECT
USING (auth.uid() = id);
```

### Permitir inserción en registro:
```sql
CREATE POLICY "Usuarios pueden insertar su propio perfil"
ON usuario FOR INSERT
WITH CHECK (auth.uid() = id);
```

### Permitir actualización del perfil:
```sql
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON usuario FOR UPDATE
USING (auth.uid() = id);
```

## 3. Verificar en Supabase Dashboard:
1. Ve a **SQL Editor**
2. Ejecuta esta query para verificar la estructura:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
```

3. Verifica que RLS esté habilitado en **Authentication > Policies**

## 4. Prueba manualmente en Supabase:
1. Create un usuario desde **Authentication > Users** o usa el formulario de registro
2. Verifica que aparezca en la tabla `usuarios` automáticamente
3. si no aparece automáticamente, revisa el `auth.tsx` para asegurar que está haciendo el INSERT

## 5. Si no funciona:
- Desactiva RLS temporalmente para testear
- Revisa la consola de errores en tu app
- Verifica los logs de Supabase (**Logs > API**)

---
**Nota**: Una vez que confirmes que todo funciona, puedes mantener RLS activado para mayor seguridad.
