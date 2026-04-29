import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import {
  ChevronDownIcon,
  CollapseIcon,
  HistoryIcon,
  PencilIcon,
  PromptIcon,
  SearchIcon,
  SettingsIcon,
} from './Icons';

const MOCK_CHATS = [
  'Complete the project proposal.',
  'I need a checklist for planning the ma...',
  'Attend the team meeting.',
  'Send out the weekly report.',
  'Complete the project report.',
  'Prepare for the client present...',
];

type Props = {
  onClose: () => void;
};

export const Drawer = ({ onClose }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.panel}>
      <View
        style={[
          styles.panelInner,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.searchBar}>
            <SearchIcon size={18} />
            <Text style={styles.searchPlaceholder}>Search</Text>
          </View>
          <TouchableOpacity style={styles.collapseBtn} onPress={onClose} activeOpacity={0.7}>
            <CollapseIcon size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <PencilIcon size={22} />
          <Text style={styles.menuLabel}>New chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <PromptIcon size={22} />
          <Text style={styles.menuLabel}>Prompts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <HistoryIcon size={22} />
          <Text style={styles.menuLabel}>Chats</Text>
          <View style={styles.chevron}>
            <ChevronDownIcon size={20} />
          </View>
        </TouchableOpacity>

        <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
          {MOCK_CHATS.map((chat, i) => (
            <TouchableOpacity key={i} style={styles.chatItem} activeOpacity={0.7}>
              <Text style={styles.chatItemText} numberOfLines={1}>
                {chat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>MC</Text>
          </View>
          <Text style={styles.userName}>Mony Chanbopha</Text>
          <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
            <SettingsIcon size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  panelInner: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 90,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
  },
  collapseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  menuLabel: {
    ...typography.body,
    fontFamily: 'DMSans_500Medium',
    color: colors.textPrimary,
  },
  chevron: {
    marginLeft: 'auto',
  },
  chatList: {
    flex: 1,
    marginTop: 4,
  },
  chatItem: {
    paddingVertical: 12,
  },
  chatItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
  },
  userName: {
    ...typography.body,
    fontFamily: 'DMSans_600SemiBold',
    color: colors.textPrimary,
    flex: 1,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
