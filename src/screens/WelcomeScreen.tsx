import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobinLogo } from '../components/GlobinLogo';
import { GradientText } from '../components/GradientText';
import { AppleIcon, EnglishFlagIcon, GoogleIcon, KhmerFlagIcon, MicrosoftIcon } from '../components/Icons';
import { SocialButton } from '../components/SocialButton';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = StackNavigationProp<RootStackParamList, 'Welcome'>;
type Lang = 'en' | 'kh';

const LANGUAGES: { id: Lang; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'en', label: 'English', Icon: EnglishFlagIcon },
  { id: 'kh', label: 'Khmer', Icon: KhmerFlagIcon },
];

export const WelcomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const goToChat = () => navigation.navigate('Chat');
  const [lang, setLang] = useState<Lang>('en');
  const [open, setOpen] = useState(false);

  const selected = LANGUAGES.find(l => l.id === lang)!;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 250 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [open]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.langPill} activeOpacity={0.8} onPress={() => setOpen(o => !o)}>
          <selected.Icon size={22} />
          <Text style={styles.langText}>{lang === 'en' ? 'ENG' : 'KHM'}</Text>
        </TouchableOpacity>

        {open && (
          <Animated.View style={[styles.dropdown, {
          opacity: opacityAnim,
          transform: [
            { scaleY: scaleAnim },
            { translateY: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] }) },
          ],
        }]}>
            {LANGUAGES.map(({ id, label, Icon }, index) => (
              <TouchableOpacity
                key={id}
                style={[styles.dropdownItem, index < LANGUAGES.length - 1 && styles.dropdownItemBorder]}
                activeOpacity={0.7}
                onPress={() => { setLang(id); setOpen(false); }}
              >
                <Icon size={24} />
                <Text style={[styles.dropdownLabel, lang === id && styles.dropdownLabelActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </View>

      <View style={styles.heroSection}>
        <GlobinLogo size={60} />
        <Text style={styles.title}>Welcome to Globin</Text>
        <GradientText text="Khmer AI Assistant" style={styles.subtitle} />
      </View>

      <View style={styles.buttonsSection}>
        <SocialButton
          label="Sign In with Microsoft"
          icon={<MicrosoftIcon size={20} />}
          onPress={goToChat}
        />
        <SocialButton
          label="Sign In with Google"
          icon={<GoogleIcon size={20} />}
          onPress={goToChat}
        />
        <SocialButton
          label="Sign In with Apple"
          icon={<AppleIcon size={20} />}
          onPress={goToChat}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialButton label="Sign In with Email" onPress={goToChat} />

        <Text style={styles.terms}>
          By proceeding, you accept our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{'\n'}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 10,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  langText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    minWidth: 140,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dropdownItemBorder: {
    //borderBottomWidth: 1,
    //borderBottomColor: 'rgba(144, 144, 144, 0.1)',
  },
  dropdownLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: colors.textPrimary,
  },
  dropdownLabelActive: {
    fontFamily: 'DMSans_600SemiBold',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 24,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  buttonsSection: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 12,
    color: colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: 'DMSans_400Regular',
    marginHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  terms: {
    fontFamily: 'DMSans_400Regular',
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
  },
  termsLink: {
    fontFamily: 'DMSans_600SemiBold',
    color: colors.textPrimary,
  },
});
