import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme, DesignPreset } from '../../core/theme/ThemeContext';
import { X, Sun, Moon, Check, Sliders, Sparkles } from 'lucide-react-native';

const PRESET_OPTIONS: { id: DesignPreset; name: string; icon: string; desc: string; tag: string }[] = [
  {
    id: 'glass',
    name: 'Liquid Glass',
    icon: '💧',
    desc: 'Crystal translucent glass with 32px blur, specular top sheen, and vibrant glowing aurora orbs shining underneath.',
    tag: 'Liquid Glass',
  },
  {
    id: 'clay',
    name: 'Claymorphism',
    icon: '🎨',
    desc: 'Soft 3D inflated pillowy cards with double depth shadows, marshmallow pastel canvas, and friendly rounded font.',
    tag: 'Soft 3D Clay',
  },
  {
    id: 'maximalism',
    name: 'Cyber Maximalism',
    icon: '⚡',
    desc: 'Cyberpunk neon matrix grid, glowing HUD borders, hyper-saturated accents, and monospace tech font.',
    tag: 'Cyber Neon',
  },
  {
    id: 'brutalism',
    name: 'Neo-Brutalism',
    icon: '🕹️',
    desc: 'Bold 3px solid borders, hard 5px drop-shadows with zero blur, retro pop dots, and ultra-bold block font.',
    tag: 'Retro Arcade',
  },
  {
    id: 'minimal',
    name: 'Minimalist Porcelain',
    icon: '🏛️',
    desc: 'Clean monolithic canvas with razor-thin hairline borders, pure matte surfaces, and elegant Swiss typography.',
    tag: 'Clean Minimal',
  },
];

const ACCENT_HUES = [
  { color: '#38BDF8', name: 'Cyber Cyan' },
  { color: '#6366F1', name: 'Electric Indigo' },
  { color: '#F43F5E', name: 'Neon Rose' },
  { color: '#10B981', name: 'Emerald Mint' },
  { color: '#F59E0B', name: 'Sunset Gold' },
  { color: '#A855F7', name: 'Purple Ray' },
];

const RADIUS_OPTIONS = [
  { value: 6, label: 'Sharp Tech', sub: '6px' },
  { value: 18, label: 'Sleek Modern', sub: '18px' },
  { value: 26, label: 'Clay Bubble', sub: '26px' },
];

export const ThemeCustomizerDrawer: React.FC = () => {
  const {
    theme,
    isDark,
    preset,
    accentColor,
    borderRadius,
    isDrawerOpen,
    closeThemeDrawer,
    setMode,
    setPreset,
    setAccentColor,
    setBorderRadius,
  } = useTheme();

  return (
    <Modal visible={isDrawerOpen} transparent animationType="fade" onRequestClose={closeThemeDrawer}>
      <View style={[styles.backdrop, { backgroundColor: theme.colors.modalOverlay }]}>
        {/* Click outside to close */}
        <TouchableOpacity style={styles.backdropDismiss} activeOpacity={1} onPress={closeThemeDrawer} />

        {/* Slide-over Drawer Content */}
        <View
          style={[
            styles.drawerCard,
            {
              backgroundColor: isDark ? '#090E1A' : '#FFFFFF',
              borderColor: theme.colors.borderGlass,
            },
            Platform.select({
              web: {
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                boxShadow: isDark
                  ? '-10px 0 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(56, 189, 248, 0.15)'
                  : '-8px 0 30px rgba(15, 23, 42, 0.12)',
              } as any,
            }),
          ]}
        >
          {/* Drawer Header */}
          <View style={[styles.drawerHeader, { borderBottomColor: theme.colors.borderGlass }]}>
            <View style={styles.headerTitleWrap}>
              <View style={[styles.headerIconBadge, { backgroundColor: `${accentColor}25` }]}>
                <Sliders size={18} color={accentColor} />
              </View>
              <View>
                <Text style={[styles.drawerTitle, { color: theme.colors.textPrimary }]}>
                  Aesthetics Studio
                </Text>
                <Text style={[styles.drawerSub, { color: theme.colors.textMuted }]}>
                  Customize Visual Styles &amp; Backgrounds
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={closeThemeDrawer}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
                  borderColor: theme.colors.borderGlass,
                },
              ]}
            >
              <X size={18} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.drawerBody} showsVerticalScrollIndicator={false}>
            {/* SECTION 1: THEME MODE (DARK / LIGHT) */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.accentSecondary }]}>
                1. COLOR THEME MODE
              </Text>

              <View style={styles.modeRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMode('dark')}
                  style={[
                    styles.modeBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(56, 189, 248, 0.15)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(15, 23, 42, 0.04)',
                      borderColor: isDark ? '#38BDF8' : theme.colors.borderGlass,
                    },
                  ]}
                >
                  <Moon size={18} color={isDark ? '#38BDF8' : theme.colors.textMuted} />
                  <View>
                    <Text style={[styles.modeTitle, { color: isDark ? '#38BDF8' : theme.colors.textPrimary }]}>
                      Dark Mode
                    </Text>
                    <Text style={[styles.modeSub, { color: theme.colors.textMuted }]}>
                      Deep obsidian &amp; neon
                    </Text>
                  </View>
                  {isDark && <Check size={16} color="#38BDF8" style={styles.checkIcon} />}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMode('light')}
                  style={[
                    styles.modeBtn,
                    {
                      backgroundColor: !isDark
                        ? 'rgba(99, 102, 241, 0.12)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(15, 23, 42, 0.04)',
                      borderColor: !isDark ? '#6366F1' : theme.colors.borderGlass,
                    },
                  ]}
                >
                  <Sun size={18} color={!isDark ? '#6366F1' : theme.colors.textMuted} />
                  <View>
                    <Text style={[styles.modeTitle, { color: !isDark ? '#6366F1' : theme.colors.textPrimary }]}>
                      Light Mode
                    </Text>
                    <Text style={[styles.modeSub, { color: theme.colors.textMuted }]}>
                      Crisp daylight contrast
                    </Text>
                  </View>
                  {!isDark && <Check size={16} color="#6366F1" style={styles.checkIcon} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* SECTION 2: DESIGN STYLE PRESETS */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.colors.accentSecondary }]}>
                  2. DESIGN STYLE PRESETS
                </Text>
              </View>

              <View style={styles.presetList}>
                {PRESET_OPTIONS.map((opt) => {
                  const isSelected = preset === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={0.8}
                      onPress={() => setPreset(opt.id)}
                      style={[
                        styles.presetCard,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(56, 189, 248, 0.12)'
                              : 'rgba(99, 102, 241, 0.08)'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.04)'
                            : 'rgba(15, 23, 42, 0.03)',
                          borderColor: isSelected ? accentColor : theme.colors.borderGlass,
                        },
                      ]}
                    >
                      <View style={styles.presetLeft}>
                        <Text style={styles.presetEmoji}>{opt.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <View style={styles.presetTitleRow}>
                            <Text style={[styles.presetName, { color: isSelected ? accentColor : theme.colors.textPrimary }]}>
                              {opt.name}
                            </Text>
                            <View style={[styles.tagPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                              <Text style={[styles.tagPillText, { color: theme.colors.textMuted }]}>
                                {opt.tag}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.presetDesc, { color: theme.colors.textSecondary }]}>
                            {opt.desc}
                          </Text>
                        </View>
                      </View>
                      {isSelected && <Check size={18} color={accentColor} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* SECTION 3: NEON ACCENT PALETTE */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.accentSecondary }]}>
                3. ACCENT COLOR
              </Text>

              <View style={styles.colorPaletteRow}>
                {ACCENT_HUES.map((hue) => {
                  const isSelected = accentColor === hue.color;
                  return (
                    <TouchableOpacity
                      key={hue.color}
                      onPress={() => setAccentColor(hue.color)}
                      style={[
                        styles.colorCircle,
                        {
                          backgroundColor: hue.color,
                          borderColor: isSelected ? '#FFFFFF' : 'transparent',
                          transform: [{ scale: isSelected ? 1.18 : 1 }],
                        },
                        Platform.select({
                          web: {
                            boxShadow: isSelected ? `0 0 16px ${hue.color}` : 'none',
                          } as any,
                        }),
                      ]}
                    >
                      {isSelected && <Check size={14} color="#FFFFFF" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* SECTION 4: CARD GEOMETRY / CORNER RADIUS */}
            <View style={[styles.section, { marginBottom: 30 }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.accentSecondary }]}>
                4. CARD CORNER GEOMETRY
              </Text>

              <View style={styles.radiusRow}>
                {RADIUS_OPTIONS.map((rad) => {
                  const isSelected = borderRadius === rad.value;
                  return (
                    <TouchableOpacity
                      key={rad.value}
                      onPress={() => setBorderRadius(rad.value)}
                      style={[
                        styles.radiusBtn,
                        {
                          backgroundColor: isSelected
                            ? isDark
                              ? 'rgba(56, 189, 248, 0.15)'
                              : 'rgba(99, 102, 241, 0.10)'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.04)'
                            : 'rgba(15, 23, 42, 0.03)',
                          borderColor: isSelected ? accentColor : theme.colors.borderGlass,
                        },
                      ]}
                    >
                      <Text style={[styles.radiusLabel, { color: isSelected ? accentColor : theme.colors.textPrimary }]}>
                        {rad.label}
                      </Text>
                      <Text style={[styles.radiusSub, { color: theme.colors.textMuted }]}>
                        {rad.sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  drawerCard: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    borderLeftWidth: 1.5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  drawerSub: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  modeRow: {
    gap: 8,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  modeSub: {
    fontSize: 11,
    marginTop: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  presetList: {
    gap: 8,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  presetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  presetEmoji: {
    fontSize: 22,
  },
  presetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '800',
  },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tagPillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  presetDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  colorPaletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  radiusLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  radiusSub: {
    fontSize: 10,
    marginTop: 2,
  },
});
