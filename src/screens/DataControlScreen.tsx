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
import { ArchiveIcon, BackArrowIcon, ChevronRightIcon, DatabaseIcon, DeleteIcon } from '../components/Icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export const DataControlScreen = () => {
  const navigation = useNavigation();
  const [improveModel, setImproveModel] = useState(true);
  const [includeAudio, setIncludeAudio] = useState(true);

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

        <Text style={styles.headerTitle}>Data Control</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Improve the Model */}
        <View style={styles.cardWrap}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Improve the Model</Text>
                <Switch
                  value={improveModel}
                  onValueChange={setImproveModel}
                  trackColor={{ false: colors.border, true: '#007AFF' }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          </BlurView>
        </View>
        <Text style={styles.description}>
          Help improve Globin by allowing your content to be used for model training. We apply safeguards to keep your data private and secure.
        </Text>

        {/* Include Audio Recordings */}
        <View style={[styles.cardWrap, styles.cardWrapSpaced]}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Include Audio Recordings</Text>
                <Switch
                  value={includeAudio}
                  onValueChange={setIncludeAudio}
                  trackColor={{ false: colors.border, true: '#007AFF' }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          </BlurView>
        </View>
        <Text style={styles.description}>
          Allow audio from your voice chats to be used for model training, helping improve voice quality and performance for everyone.
        </Text>

        {/* AI Data Sharing */}
        <View style={[styles.cardWrap, styles.cardWrapSpaced]}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                <Text style={styles.toggleLabel}>AI Data Sharing</Text>
                <View style={{ opacity: 0.3 }}>
                  <ChevronRightIcon size={18} />
                </View>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Archive / Delete conversations */}
        <View style={[styles.cardWrap, styles.cardWrapSpaced]}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <TouchableOpacity style={[styles.actionRow, styles.rowBorder]} activeOpacity={0.7}>
                <ArchiveIcon size={20} />
                <Text style={styles.actionLabelBlue}>Archive All Conversations</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                <DeleteIcon size={20} />
                <Text style={styles.actionLabelRed}>Delete All Conversations</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Delete Account */}
        <View style={[styles.cardWrap, styles.cardWrapSpaced]}>
          <BlurView intensity={60} tint="light" style={styles.cardBlur}>
            <View style={styles.cardInner}>
              <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                <DeleteIcon size={20} />
                <Text style={styles.actionLabelRed}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
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
    paddingTop: 8,
  },
  cardWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardWrapSpaced: {
    marginTop: 20,
  },
  cardBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardInner: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  toggleLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,229,229,0.6)',
  },
  actionLabelBlue: {
    ...typography.body,
    fontFamily: 'DMSans_500Medium',
    color: '#007AFF',
  },
  actionLabelRed: {
    ...typography.body,
    fontFamily: 'DMSans_500Medium',
    color: 'rgba(239, 68, 68, 1)',
  },
});
