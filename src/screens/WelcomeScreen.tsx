import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Path as SvgPath, Svg as SvgView } from 'react-native-svg';
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

const EyeOffIcon = ({ size = 20 }: { size?: number }) => (
  <SvgView width={size} height={size} viewBox="0 0 24 24" fill="none">
    <SvgPath d="M2 2L22 22" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <SvgPath d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <SvgPath d="M14 13.9C13.4857 14.5758 12.7733 15 12 15C10.3431 15 9 13.3807 9 11.4C9 10.5672 9.27273 9.80733 9.73418 9.21069" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </SvgView>
);

const EyeIcon = ({ size = 20 }: { size?: number }) => (
  <SvgView width={size} height={size} viewBox="0 0 24 24" fill="none">
    <SvgPath d="M2 12C2 12 5.63636 5 12 5C18.3636 5 22 12 22 12C22 12 18.3636 19 12 19C5.63636 19 2 12 2 12Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <SvgPath d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </SvgView>
);

export const WelcomeScreen = () => {
  const navigation = useNavigation<Nav>();
  const goToChat = () => navigation.navigate('Chat');

  const [lang, setLang] = useState<Lang>('en');
  const [open, setOpen] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const selected = LANGUAGES.find(l => l.id === lang)!;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  const canSignIn = email.length > 0 && password.length > 0;

  useFocusEffect(
    useCallback(() => {
      setShowEmailForm(false);
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setOpen(false);
      formAnim.setValue(0);
    }, [formAnim])
  );

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

  useEffect(() => {
    Animated.spring(formAnim, {
      toValue: showEmailForm ? 1 : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 140,
      mass: 0.9,
    }).start();
  }, [showEmailForm]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.langPill} activeOpacity={0.8} onPress={() => setOpen(o => !o)}>
          <BlurView intensity={60} tint="light" style={styles.langBlur}>
            <View style={styles.langInner}>
              <selected.Icon size={22} />
              <Text style={styles.langText}>{lang === 'en' ? 'ENG' : 'KHM'}</Text>
            </View>
          </BlurView>
        </TouchableOpacity>

        {open && (
          <Animated.View style={[styles.dropdown, {
            opacity: opacityAnim,
            transform: [
              { scaleY: scaleAnim },
              { translateY: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] }) },
            ],
          }]}>
            <BlurView intensity={60} tint="light" style={styles.dropdownBlur}>
              <View style={styles.dropdownInner}>
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
              </View>
            </BlurView>
          </Animated.View>
        )}
      </View>

      <View style={styles.heroSection}>
        <GlobinLogo size={60} />
        <Text style={styles.title}>Welcome to Globin</Text>
        <GradientText text="Khmer AI Assistant" style={styles.subtitle} />
      </View>

      <View style={styles.buttonsSection}>
        <SocialButton label="Sign In with Microsoft" icon={<MicrosoftIcon size={20} />} onPress={goToChat} />
        <SocialButton label="Sign In with Google" icon={<GoogleIcon size={20} />} onPress={goToChat} />
        <SocialButton label="Sign In with Apple" icon={<AppleIcon size={20} />} onPress={goToChat} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        {!showEmailForm ? (
          <SocialButton label="Sign In with Email" onPress={() => setShowEmailForm(true)} />
        ) : (
          <Animated.View style={{
            opacity: formAnim,
            transform: [
              { translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
              { scale: formAnim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
            ],
          }}>
            {/* Email input */}
            <View style={styles.inputWrap}>
              <BlurView intensity={60} tint="light" style={styles.inputBlur}>
                <View style={styles.inputInner}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </BlurView>
            </View>

            {/* Password input */}
            <View style={styles.inputWrap}>
              <BlurView intensity={60} tint="light" style={styles.inputBlur}>
                <View style={styles.inputInner}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Password"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(v => !v)} activeOpacity={0.7} hitSlop={8}>
                    {showPassword ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotWrap} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>

            {/* Sign In button */}
            <TouchableOpacity
              style={[styles.signInBtn, !canSignIn && styles.signInBtnDisabled]}
              onPress={canSignIn ? goToChat : undefined}
              activeOpacity={0.85}
            >
              <BlurView intensity={60} tint="light" style={styles.signInBlur}>
                <View style={[styles.signInInner, !canSignIn && styles.signInInnerDisabled]}>
                  <Text style={[styles.signInLabel, !canSignIn && styles.signInLabelDisabled]}>Sign In</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        )}

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
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  langBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  langInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  langText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    minWidth: 140,
  },
  dropdownBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  dropdownInner: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.4)',
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
    marginTop: 60,
    paddingHorizontal: 24,
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
  inputWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  inputBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    height: 48,
    flex: 1,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 14,
  },
  forgotText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    color: colors.textPrimary,
  },
  signInBtn: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signInBtnDisabled: {
    opacity: 0.5,
  },
  signInBlur: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  signInInner: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInInnerDisabled: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  signInLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  signInLabelDisabled: {
    color: colors.textMuted,
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
