import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackArrowIcon,
  BellIcon,
  ChevronDownIcon,
  DatabaseIcon,
  DocumentIcon,
  EnglishFlagIcon,
  GlobeIcon,
  KhmerFlagIcon,
  LockIcon,
  LogoutIcon,
  SunIcon,
} from '../components/Icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type Lang = 'en' | 'kh';
type AppearanceOption = 'System' | 'Light' | 'Dark';

const LANGUAGES: { id: Lang; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'en', label: 'English', Icon: EnglishFlagIcon },
  { id: 'kh', label: 'Khmer', Icon: KhmerFlagIcon },
];

const APPEARANCES: AppearanceOption[] = ['System', 'Light', 'Dark'];

const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const opening = !open;
    if (opening) {
      setOpen(true);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 280 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(chevronAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(chevronAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setOpen(false));
    }
  };

  const chevronRotate = chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const dropdownStyle = {
    opacity: opacityAnim,
    transform: [
      { scaleY: scaleAnim },
      { translateY: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) },
    ],
  };

  return { open, toggle, chevronRotate, dropdownStyle };
};

// Row height for dropdown offset calculation
const ROW_H = 53;

export const SettingsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [lang, setLang] = useState<Lang>('en');
  const [appearance, setAppearance] = useState<AppearanceOption>('System');

  const langDropdown = useDropdown();
  const appearanceDropdown = useDropdown();

  const selectedLang = LANGUAGES.find(l => l.id === lang)!;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtnWrap}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={12}
        >
          <BlurView intensity={60} tint="light" style={styles.backBlur}>
            <View style={styles.backInner}>
              <BackArrowIcon size={20} />
            </View>
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backBtnWrap} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>MC</Text>
          </View>
          <Text style={styles.profileName}>Mony Chanbopha</Text>
          <Text style={styles.profileEmail}>bopha.dev@example.com</Text>
        </View>

        {/* Group 1: Preferences — cardWrap has no overflow:hidden so dropdowns can float */}
        <View style={[styles.cardWrap, { zIndex: 10 }]}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>

              {/* App Language */}
              <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={langDropdown.toggle} activeOpacity={0.7}>
                <View style={styles.rowIcon}><GlobeIcon size={20} /></View>
                <Text style={styles.rowLabel}>App language</Text>
                <View style={styles.rowRight}>
                  <Text style={styles.rowValue}>{selectedLang.label}</Text>
                  <Animated.View style={[styles.chevronWrap, { transform: [{ rotate: langDropdown.chevronRotate }] }]}>
                    <ChevronDownIcon size={18} />
                  </Animated.View>
                </View>
              </TouchableOpacity>

              {/* Appearance */}
              <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={appearanceDropdown.toggle} activeOpacity={0.7}>
                <View style={styles.rowIcon}><SunIcon size={20} /></View>
                <Text style={styles.rowLabel}>Appearance</Text>
                <View style={styles.rowRight}>
                  <Text style={styles.rowValue}>{appearance}</Text>
                  <Animated.View style={[styles.chevronWrap, { transform: [{ rotate: appearanceDropdown.chevronRotate }] }]}>
                    <ChevronDownIcon size={18} />
                  </Animated.View>
                </View>
              </TouchableOpacity>

              {/* Notifications */}
              <View style={styles.row}>
                <View style={styles.rowIcon}><BellIcon size={20} /></View>
                <Text style={styles.rowLabel}>Notifications</Text>
                <Switch
                  value={notificationsOn}
                  onValueChange={setNotificationsOn}
                  trackColor={{ false: colors.border, true: '#007AFF' }}
                  thumbColor={colors.white}
                />
              </View>

            </View>
          </BlurView>

          {/* Lang dropdown — sibling of BlurView, not clipped */}
          {langDropdown.open && (
            <Animated.View style={[styles.floatingDropdown, { top: ROW_H, right: 12 }, langDropdown.dropdownStyle]}>
              <BlurView intensity={60} tint="light" style={styles.dropdownBlur}>
                <View style={styles.dropdownInner}>
                  {LANGUAGES.map(({ id, label, Icon }, i) => (
                    <TouchableOpacity
                      key={id}
                      style={[styles.dropdownItem, i < LANGUAGES.length - 1 && styles.dropdownItemBorder]}
                      activeOpacity={0.7}
                      onPress={() => { setLang(id); langDropdown.toggle(); }}
                    >
                      <Icon size={22} />
                      <Text style={[styles.dropdownLabel, lang === id && styles.dropdownLabelActive]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </BlurView>
            </Animated.View>
          )}

          {/* Appearance dropdown — sibling of BlurView, not clipped */}
          {appearanceDropdown.open && (
            <Animated.View style={[styles.floatingDropdown, { top: ROW_H * 2, right: 12 }, appearanceDropdown.dropdownStyle]}>
              <BlurView intensity={60} tint="light" style={styles.dropdownBlur}>
                <View style={styles.dropdownInner}>
                  {APPEARANCES.map((option, i) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.dropdownItem, i < APPEARANCES.length - 1 && styles.dropdownItemBorder]}
                      activeOpacity={0.7}
                      onPress={() => { setAppearance(option); appearanceDropdown.toggle(); }}
                    >
                      <Text style={[styles.dropdownLabel, appearance === option && styles.dropdownLabelActive]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </BlurView>
            </Animated.View>
          )}
        </View>

        {/* Group 2: Data */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.navigate('DataControl')}
                activeOpacity={0.7}
              >
                <View style={styles.rowIcon}><DatabaseIcon size={20} /></View>
                <Text style={styles.rowLabel}>Data Control</Text>
                <View style={styles.chevronRight}><ChevronDownIcon size={18} /></View>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Group 3: Legal */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <TouchableOpacity style={[styles.row, styles.rowBorder]} activeOpacity={0.7}>
                <View style={styles.rowIcon}><DocumentIcon size={20} /></View>
                <Text style={styles.rowLabel}>Terms of Use</Text>
                <View style={styles.chevronRight}><ChevronDownIcon size={18} /></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                <View style={styles.rowIcon}><LockIcon size={20} /></View>
                <Text style={styles.rowLabel}>Privacy Policy</Text>
                <View style={styles.chevronRight}><ChevronDownIcon size={18} /></View>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Group 4: Logout */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7}>
                <LogoutIcon size={20} />
                <Text style={styles.logoutLabel}>Logout</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        <Text style={styles.version}>Version   1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtnWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backBlur: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  backInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  headerTitle: {
    ...typography.title,
    fontSize: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 28,
    fontFamily: 'DMSans_700Bold',
  },
  profileName: {
    ...typography.title,
    fontSize: 20,
    marginBottom: 4,
  },
  profileEmail: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cardWrap: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardInner: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,229,229,0.6)',
  },
  rowIcon: {
    width: 20,
    alignItems: 'center',
  },
  rowLabel: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chevronWrap: {
    opacity: 0.4,
  },
  chevronRight: {
    opacity: 0.3,
    transform: [{ rotate: '-90deg' }],
  },
  floatingDropdown: {
    position: 'absolute',
    minWidth: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#555555',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 99,
  },
  dropdownBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  dropdownInner: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,229,229,0.5)',
  },
  dropdownLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  dropdownLabelActive: {
    fontFamily: 'DMSans_600SemiBold',
    color: '#007AFF',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
  },
  logoutLabel: {
    ...typography.body,
    fontFamily: 'DMSans_500Medium',
    color: 'rgba(239, 68, 68, 1)',
  },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
});
