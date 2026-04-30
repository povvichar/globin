import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import {
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
  ChevronRightIcon,
  DatabaseIcon,
  DocumentIcon,
  GlobeIcon,
  LockIcon,
  LogoutIcon,
  SunIcon,
} from '../components/Icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

type SettingsRowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isLast?: boolean;
};

const SettingsRow = ({ icon, label, value, onPress, rightElement, isLast }: SettingsRowProps) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.rowBorder]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.rowIcon}>{icon}</View>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={styles.rowRight}>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {rightElement ?? <ChevronRightIcon size={18} />}
    </View>
  </TouchableOpacity>
);

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsOn, setNotificationsOn] = useState(true);

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
              <BackArrowIcon size={22} />
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

        {/* Group 1: Preferences */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <SettingsRow
                icon={<GlobeIcon size={22} />}
                label="App language"
                value="English"
              />
              <SettingsRow
                icon={<SunIcon size={22} />}
                label="Appearance"
                value="System"
              />
              <SettingsRow
                icon={<BellIcon size={22} />}
                label="Notifications"
                isLast
                rightElement={
                  <Switch
                    value={notificationsOn}
                    onValueChange={setNotificationsOn}
                    trackColor={{ false: colors.border, true: '#007AFF' }}
                    thumbColor={colors.white}
                  />
                }
              />
            </View>
          </BlurView>
        </View>

        {/* Group 2: Data */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <SettingsRow
                icon={<DatabaseIcon size={22} />}
                label="Data Control"
                isLast
              />
            </View>
          </BlurView>
        </View>

        {/* Group 3: Legal */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <SettingsRow
                icon={<DocumentIcon size={22} />}
                label="Terms of Use"
              />
              <SettingsRow
                icon={<LockIcon size={22} />}
                label="Privacy Policy"
                isLast
              />
            </View>
          </BlurView>
        </View>

        {/* Group 4: Logout */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7}>
                <LogoutIcon size={22} />
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
    fontSize: 20,
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
    overflow: 'hidden',
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
    width: 26,
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
    color: colors.primary,
  },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
  backChevron: {
    fontSize: 22,
    fontFamily: 'DMSans_500Medium',
    color: colors.textPrimary,
    lineHeight: 26,
  },
});
