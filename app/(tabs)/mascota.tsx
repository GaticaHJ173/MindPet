import React, { useMemo } from 'react';

import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useUserStore } from '@/store/useUserStore';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function KawaiiCat({ size = 190 }: { size?: number }) {
  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      {/* Sombra ovalada pastel */}
      <View
        style={{
          position: 'absolute',
          left: s * 0.12,
          right: s * 0.12,
          bottom: s * 0.04,
          height: s * 0.22,
          backgroundColor: 'rgba(145,131,175,0.18)',
          borderRadius: 999,
        }}
      />

      {/* Decoraciones suaves alrededor */}
      <View
        style={{
          position: 'absolute',
          left: s * 0.02,
          top: s * 0.08,
          width: s * 0.16,
          height: s * 0.16,
          backgroundColor: 'rgba(255,179,208,0.26)',
          borderRadius: 999,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: s * 0.07 }}>❤</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          right: s * 0.05,
          top: s * 0.14,
          width: s * 0.18,
          height: s * 0.18,
          backgroundColor: 'rgba(145,131,175,0.14)',
          borderRadius: 26,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ rotate: '-10deg' }],
        }}
      >
        <Text style={{ fontSize: s * 0.07 }}>❀</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          left: s * 0.08,
          bottom: s * 0.12,
          width: s * 0.14,
          height: s * 0.14,
          backgroundColor: 'rgba(165,243,252,0.20)',
          borderRadius: 999,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ rotate: '12deg' }],
        }}
      >
        <Text style={{ fontSize: s * 0.07 }}>✿</Text>
      </View>

      {/* Cuerpo */}
      <View
        style={{
          position: 'absolute',
          left: s * 0.18,
          top: s * 0.24,
          width: s * 0.64,
          height: s * 0.58,
          borderRadius: 999,
          backgroundColor: '#F7E7D6',
          borderWidth: 1,
          borderColor: 'rgba(255,179,208,0.35)',
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 2,
          justifyContent: 'flex-start',
        }}
      >
        {/* Cola mini */}
        <View
          style={{
            position: 'absolute',
            right: -s * 0.06,
            top: s * 0.25,
            width: s * 0.18,
            height: s * 0.18,
            borderRadius: 999,
            backgroundColor: '#F7E7D6',
            borderWidth: 1,
            borderColor: 'rgba(255,179,208,0.35)',
            transform: [{ rotate: '15deg' }],
          }}
        />

        {/* Carita: ojos grandes y mejillas */}
        <View style={{ position: 'absolute', left: s * 0.16, top: s * 0.14, right: 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View
              style={{
                width: s * 0.14,
                height: s * 0.14,
                borderRadius: 999,
                backgroundColor: '#2B2B2B',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: s * 0.045,
                  height: s * 0.045,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              />
            </View>
            <View
              style={{
                width: s * 0.14,
                height: s * 0.14,
                borderRadius: 999,
                backgroundColor: '#2B2B2B',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: s * 0.045,
                  height: s * 0.045,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              />
            </View>
          </View>

          {/* Nariz y sonrisa */}
          <View style={{ marginTop: s * 0.04, alignItems: 'center' }}>
            <View
              style={{
                width: s * 0.045,
                height: s * 0.03,
                borderRadius: 10,
                backgroundColor: '#FFB3D0',
                opacity: 0.9,
              }}
            />
            <View
              style={{
                width: s * 0.12,
                height: s * 0.06,
                marginTop: s * 0.02,
                borderBottomWidth: 3,
                borderBottomColor: 'rgba(43,43,43,0.55)',
                borderRadius: 999,
              }}
            />
          </View>

          {/* Mejillas rosadas */}
          <View style={{ position: 'absolute', left: -s * 0.02, top: s * 0.04 }}>
            <View
              style={{
                width: s * 0.10,
                height: s * 0.08,
                borderRadius: 999,
                backgroundColor: 'rgba(255,179,208,0.65)',
                transform: [{ rotate: '-10deg' }],
              }}
            />
          </View>
          <View style={{ position: 'absolute', right: -s * 0.02, top: s * 0.04 }}>
            <View
              style={{
                width: s * 0.10,
                height: s * 0.08,
                borderRadius: 999,
                backgroundColor: 'rgba(255,179,208,0.65)',
                transform: [{ rotate: '10deg' }],
              }}
            />
          </View>
        </View>

        {/* Collar pequeño */}
        <View
          style={{
            position: 'absolute',
            left: s * 0.22,
            right: s * 0.22,
            top: s * 0.42,
            height: s * 0.07,
            borderRadius: 999,
            backgroundColor: 'rgba(145,131,175,0.24)',
            borderWidth: 1,
            borderColor: 'rgba(145,131,175,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: s * 0.05,
              height: s * 0.05,
              borderRadius: 999,
              backgroundColor: 'rgba(255,179,208,0.75)',
              borderWidth: 1,
              borderColor: 'rgba(255,179,208,0.9)',
            }}
          />
        </View>

        {/* Orejas */}
        <View
          style={{
            position: 'absolute',
            left: s * 0.15,
            top: -s * 0.05,
            width: s * 0.18,
            height: s * 0.14,
            borderRadius: 40,
            backgroundColor: '#F7E7D6',
            borderWidth: 1,
            borderColor: 'rgba(255,179,208,0.35)',
            transform: [{ rotate: '-18deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: s * 0.14,
            top: -s * 0.05,
            width: s * 0.18,
            height: s * 0.14,
            borderRadius: 40,
            backgroundColor: '#F7E7D6',
            borderWidth: 1,
            borderColor: 'rgba(255,179,208,0.35)',
            transform: [{ rotate: '18deg' }],
          }}
        />
      </View>

      {/* Levitación kawaii */}
      <View
        style={{
          position: 'absolute',
          left: s * 0.03,
          top: s * 0.02,
          width: s * 0.22,
          height: s * 0.22,
          borderRadius: 999,
          backgroundColor: 'rgba(255,179,208,0.20)',
          borderWidth: 1,
          borderColor: 'rgba(255,179,208,0.25)',
          opacity: 0.65,
        }}
      />
    </View>
  );
}

function PastelCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export default function MascotaScreen() {
  const router = useRouter();
  const nombre = useUserStore((s) => s.nombre) || 'Ana';

  const progreso = 70;
  const completados = 7;
  const total = 10;

  const puntos = 125;
  const rachaDias = 12;

  const nivel = 2;
  const xpActual = 350;
  const xpSiguiente = 500;

  const xpPorcentaje = clamp(Math.round((xpActual / xpSiguiente) * 100), 0, 100);

  const headerAnim = useMemo(() => new Animated.Value(0), []);

  const onPressSoft = () => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const floatScale = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98],
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            onPress={onPressSoft}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mascota</Text>

          <TouchableOpacity
            style={styles.configButton}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/perfil')}
          >
            <Ionicons name="settings-outline" size={22} color="#7B5CA7" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Saludo personalizado */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>¡Hola, {nombre}! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            Cuida tu mente, forma buenos hábitos y tu mascota crecerá feliz.
          </Text>
        </View>

        {/* Mascota */}
        <View style={styles.petSection}>
          <KawaiiCat size={200} />

          <Animated.View style={{ transform: [{ scale: floatScale }] }}>
            <TouchableOpacity
              style={styles.heartFab}
              activeOpacity={0.7}
              onPress={onPressSoft}
            >
              <Text style={styles.heartFabText}>❤</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Estado actual */}
        <PastelCard>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Estado actual</Text>
            <View style={styles.badgeInline}>
              <Text style={styles.badgeText}>bienestar</Text>
            </View>
          </View>

          <Text style={styles.bigEmoji}>😊 Feliz</Text>
          <Text style={styles.cardSubtitle}>
            Sigue así, tu hábito mantiene felicidad.
          </Text>
        </PastelCard>

        {/* Progreso diario */}
        <PastelCard style={{ marginTop: 12 }}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Progreso diario</Text>
            <View style={[styles.badgeInline, { backgroundColor: 'rgba(145,131,175,0.12)' }]}>
              <Text style={styles.badgeText}>hoy</Text>
            </View>
          </View>

          <View style={styles.progressTopRow}>
            <Text style={styles.progressPercent}>{progreso}%</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${progreso}%` }]}
            />
          </View>

          <Text style={styles.progressText}>
            Has completado {completados} de {total} hábitos hoy.
          </Text>
        </PastelCard>

        {/* Acciones rápidas */}
        <View style={styles.quickActionsWrap}>
          <Text style={styles.sectionLabel}>Acciones rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {[
              {
                key: 'alimentar',
                label: 'Alimentar',
                icon: 'food',
                bg: 'rgba(255,230,109,0.22)',
              },
              {
                key: 'jugar',
                label: 'Jugar',
                icon: 'gamepad',
                bg: 'rgba(110,193,255,0.20)',
              },
              {
                key: 'dormir',
                label: 'Dormir',
                icon: 'moon',
                bg: 'rgba(145,131,175,0.18)',
              },
              {
                key: 'custom',
                label: 'Personalizar',
                icon: 'shirt',
                bg: 'rgba(255,179,208,0.18)',
              },
            ].map((it) => (
              <TouchableOpacity
                key={it.key}
                style={[styles.quickCard, { backgroundColor: it.bg }]}
                activeOpacity={0.85}
                onPress={onPressSoft}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(255,255,255,0.55)' }]}>
                  {it.icon === 'food' ? (
                    <FontAwesome5 name="seedling" size={18} color="#7B5CA7" />
                  ) : it.icon === 'gamepad' ? (
                    <MaterialIcons name="sports-esports" size={18} color="#7B5CA7" />
                  ) : it.icon === 'moon' ? (
                    <Ionicons name="moon" size={18} color="#7B5CA7" />
                  ) : (
                    <MaterialIcons name="tune" size={18} color="#7B5CA7" />
                  )}
                </View>
                <Text style={styles.quickLabel}>{it.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsRow}>
          <PastelCard style={styles.statCard}>
            <Text style={styles.statTitle}>Puntos disponibles</Text>
            <Text style={styles.statValue}>{puntos}</Text>
          </PastelCard>

          <PastelCard style={styles.statCard}>
            <Text style={styles.statTitle}>Racha actual</Text>
            <Text style={styles.statValue}>{rachaDias} días</Text>
          </PastelCard>
        </View>

        {/* Nivel y experiencia */}
        <PastelCard style={{ marginTop: 12, paddingBottom: 14 }}>
          <View style={styles.levelTopRow}>
            <Text style={styles.levelTitle}>Próximo nivel: Nivel {nivel}</Text>
            <View style={styles.levelRightIcon}>
              <Text style={{ fontSize: 16 }}>🐾</Text>
            </View>
          </View>

          <View style={styles.progressBarTrackXp}>
            <View
              style={[styles.progressBarFillXp, { width: `${xpPorcentaje}%` }]}
            />
          </View>

          <Text style={styles.xpText}>
            {xpActual} / {xpSiguiente} XP
          </Text>
        </PastelCard>

        <View style={{ height: 28 }} />
      </ScrollView>

      {/* Espacio para tab bar */}
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeHeader: {
    backgroundColor: '#ffffff',
  },
  header: {
    height: 92,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(145,131,175,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 22,
    color: '#7B5CA7',
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#2a2537',
  },
  configButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(145,131,175,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    marginTop: 6,
    paddingVertical: 10,
  },
  welcomeGreeting: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2a2537',
  },
  welcomeSubtitle: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    color: '#6b7280',
    fontWeight: '600',
  },
  petSection: {
    marginTop: 10,
    alignItems: 'center',
    position: 'relative',
  },
  heartFab: {
    position: 'absolute',
    right: -6,
    top: 86,
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: 'rgba(255,179,208,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,179,208,0.55)',
  },
  heartFabText: {
    fontSize: 22,
    color: '#d946ef',
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowRadius: 6,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(145,131,175,0.12)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2a2537',
  },
  badgeInline: {
    backgroundColor: 'rgba(255,179,208,0.18)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6b7280',
  },
  bigEmoji: {
    fontSize: 18,
    fontWeight: '900',
    color: '#6b7280',
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 13.5,
    lineHeight: 19,
    color: '#6b7280',
    fontWeight: '650',
  },

  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressPercent: {
    fontSize: 26,
    fontWeight: '900',
    color: '#7B5CA7',
  },
  progressBarTrack: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(145,131,175,0.16)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(145,131,175,0.12)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7B5CA7',
    borderRadius: 999,
  },
  progressText: {
    marginTop: 10,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6b7280',
  },

  quickActionsWrap: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#2a2537',
    marginBottom: 10,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(145,131,175,0.10)',
  },
  quickIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(145,131,175,0.10)',
    marginBottom: 10,
  },
  quickLabel: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '900',
    color: '#2a2537',
  },

  statsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    marginTop: 0,
    paddingVertical: 14,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#6b7280',
  },
  statValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '900',
    color: '#7B5CA7',
  },


  levelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2a2537',
  },
  levelRightIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(145,131,175,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBarTrackXp: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(145,131,175,0.14)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(145,131,175,0.12)',
  },
  progressBarFillXp: {
    height: '100%',
    backgroundColor: '#c4b5fd',
    borderRadius: 999,
  },
  xpText: {
    marginTop: 10,
    fontSize: 13.5,
    fontWeight: '900',
    color: '#6b7280',
  },

  bottomSpacer: {
    height: 0,
  },
});

