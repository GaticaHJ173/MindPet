import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function emojiIcon(kind: string) {
  switch (kind) {
    case 'people':
      return '👥';
    case 'chat':
      return '💬';
    case 'trophy':
      return '🏆';
    case 'heart':
      return '💗';
    default:
      return '✨';
  }
}

function badgeColorFromBg(bg: string) {
  if (bg.includes('145,131,175')) return 'rgba(145,131,175,0.14)';
  if (bg.includes('255,230,109')) return 'rgba(255,230,109,0.32)';
  if (bg.includes('110,193,255')) return 'rgba(110,193,255,0.22)';
  if (bg.includes('82, 214, 170')) return 'rgba(82, 214, 170,0.20)';
  return 'rgba(145,131,175,0.14)';
}

function GatoKawaii({ size = 170 }: { size?: number }) {
  const s = size;
  return (
    <View style={{ width: s, height: s }}>
      <View
        style={{
          position: 'absolute',
          left: 10,
          top: 18,
          right: 10,
          bottom: 10,
          borderRadius: 999,
          backgroundColor: 'rgba(196, 181, 255, 0.18)',
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: s * 0.18,
          top: s * 0.26,
          width: s * 0.64,
          height: s * 0.54,
          borderRadius: 999,
          backgroundColor: '#F7E7D6',
          borderWidth: 1,
          borderColor: 'rgba(255, 179, 208, 0.35)',
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: s * 0.26,
          top: s * 0.14,
          width: s * 0.18,
          height: s * 0.14,
          borderRadius: 20,
          transform: [{ rotate: '12deg' }],
          backgroundColor: '#F7E7D6',
          borderWidth: 1,
          borderColor: 'rgba(255, 179, 208, 0.35)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: s * 0.26,
          top: s * 0.14,
          width: s * 0.18,
          height: s * 0.14,
          borderRadius: 20,
          transform: [{ rotate: '-12deg' }],
          backgroundColor: '#F7E7D6',
          borderWidth: 1,
          borderColor: 'rgba(255, 179, 208, 0.35)',
        }}
      />

      <View
        style={{
          position: 'absolute',
          left: s * 0.33,
          top: s * 0.40,
          width: s * 0.34,
          height: s * 0.22,
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: s * 0.03,
            width: s * 0.09,
            height: s * 0.09,
            borderRadius: 99,
            backgroundColor: '#2B2B2B',
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: s * 0.03,
            width: s * 0.09,
            height: s * 0.09,
            borderRadius: 99,
            backgroundColor: '#2B2B2B',
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: s * 0.11,
            right: s * 0.11,
            top: s * 0.10,
            height: s * 0.06,
            borderRadius: 999,
            backgroundColor: 'rgba(255, 179, 208, 0.8)',
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: s * 0.145,
            top: s * 0.13,
            width: s * 0.06,
            height: s * 0.06,
            borderRadius: 8,
            backgroundColor: '#FFB3D0',
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          right: 6,
          top: 6,
          width: s * 0.18,
          height: s * 0.18,
          borderRadius: 999,
          backgroundColor: 'rgba(255, 179, 208, 0.25)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: s * 0.07 }}>❤</Text>
      </View>
    </View>
  );
}

export default function ComunidadScreen() {
  const router = useRouter();

  const cards = [
    {
      key: 'grupos',
      title: 'Grupos de apoyo',
      body: 'Únete a grupos con personas que tienen metas similares.',
      badge: 'Próximamente',
      bg: 'rgba(145,131,175,0.12)',
      iconBg: 'rgba(145,131,175,0.18)',
      icon: 'people',
    },
    {
      key: 'foros',
      title: 'Foros y conversaciones',
      body: 'Comparte consejos, experiencias y aprendizajes.',
      badge: 'Próximamente',
      bg: 'rgba(255,230,109,0.22)',
      iconBg: 'rgba(255,230,109,0.35)',
      icon: 'chat',
    },
    {
      key: 'retos',
      title: 'Retos comunitarios',
      body: 'Participa en retos grupales y alcanza nuevas metas.',
      badge: 'Próximamente',
      bg: 'rgba(110,193,255,0.18)',
      iconBg: 'rgba(110,193,255,0.28)',
      icon: 'trophy',
    },
    {
      key: 'apoyo',
      title: 'Apoyo y motivación',
      body: 'Recibe mensajes positivos de la comunidad.',
      badge: 'Próximamente',
      bg: 'rgba(82, 214, 170, 0.18)',
      iconBg: 'rgba(82, 214, 170, 0.26)',
      icon: 'heart',
    },
  ] as const;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Comunidad</Text>

          <TouchableOpacity onPress={() => router.push('/(tabs)/perfil')}>
            <View style={styles.profileIconCircle}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Conecta con otros usuarios</Text>
          <Text style={styles.heroSubtitle}>Comparte tu progreso, motívate y crezcan juntos.</Text>

          <View style={styles.heroIllustrationWrap}>
            <GatoKawaii size={190} />
          </View>

          <View style={styles.floatingDecor}>
            <Text style={[styles.floatHeart, { left: 18 }]}>❤</Text>
            <Text style={[styles.floatHeart, { right: 28, top: 8, fontSize: 15 }]}>✿</Text>
            <Text style={[styles.floatHeart, { left: 78, top: 78 }]}>♥</Text>
          </View>
        </View>

        <View style={styles.subSection}>
          <Text style={styles.subTitle}>Apartado de comunidad - Próximamente</Text>
          <Text style={styles.subBody}>Este espacio estará disponible muy pronto.</Text>
        </View>

        <View style={styles.cardsWrap}>
          {cards.map((c) => (
            <View key={c.key} style={[styles.card, { backgroundColor: c.bg }]}>
              <View style={[styles.cardIconCircle, { backgroundColor: c.iconBg }]}>
                <Text style={styles.cardIconText}>{emojiIcon(c.icon)}</Text>
              </View>

              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardBody}>{c.body}</Text>
              </View>

              <View style={[styles.badge, { backgroundColor: badgeColorFromBg(c.bg) }]}>
                <Text style={styles.badgeText}>{c.badge}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomBox}>
          <GatoKawaii size={138} />
          <Text style={styles.bottomTitle}>¡Algo increíble se está preparando!</Text>
          <Text style={styles.bottomSubtitle}>
            Muy pronto podrás conectar, compartir y crecer junto a otros usuarios.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  safeHeader: {
    backgroundColor: '#f5f1ff',
  },

  header: {
    height: 120,
    paddingHorizontal: 15,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#9183af',
  },

  menuButton: {
    padding: 8,
  },

  menuIcon: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '800',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },

  profileIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59,130,246,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileIcon: {
    fontSize: 22,
  },

  scrollContent: {
    paddingBottom: 34,
  },

  hero: {
    marginTop: 6,
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2a2537',
  },

  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    fontWeight: '600',
    maxWidth: 320,
  },

  heroIllustrationWrap: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  floatingDecor: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 120,
    height: 110,
    pointerEvents: 'none',
  },

  floatHeart: {
    position: 'absolute',
    color: 'rgba(255, 105, 180, 0.75)',
    fontSize: 18,
  },

  subSection: {
    marginTop: 18,
    paddingHorizontal: 18,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2a2537',
  },

  subBody: {
    marginTop: 6,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },

  cardsWrap: {
    marginTop: 14,
    paddingHorizontal: 14,
    gap: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    minHeight: 84,
  },

  cardIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  cardIconText: {
    fontSize: 24,
  },

  cardTextWrap: {
    flex: 1,
    paddingRight: 8,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2a2537',
  },

  cardBody: {
    marginTop: 6,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#6B7280',
    fontWeight: '600',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6B7280',
  },

  bottomBox: {
    marginTop: 18,
    marginHorizontal: 18,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  bottomTitle: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '900',
    color: '#2a2537',
    textAlign: 'center',
  },

  bottomSubtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
});

