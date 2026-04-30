import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../components/ChatInput';
import { Drawer } from '../components/Drawer';
import { GlobinLogo } from '../components/GlobinLogo';
import { GradientText } from '../components/GradientText';
import { DotsIcon, MenuIcon, PencilIcon } from '../components/Icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PEEK_WIDTH = 70;
const SLIDE_DISTANCE = SCREEN_WIDTH - PEEK_WIDTH;

export const ChatScreen = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const radiusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: drawerOpen ? 1 : 0,
        useNativeDriver: true,
        damping: 24,
        mass: 0.9,
        stiffness: 180,
      }),
      Animated.timing(radiusAnim, {
        toValue: drawerOpen ? 1 : 0,
        duration: 280,
        useNativeDriver: false,
      }),
    ]).start();
  }, [drawerOpen]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SLIDE_DISTANCE],
  });

  const borderRadius = radiusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 28],
  });

  return (
    <View style={styles.root}>
      <Drawer onClose={() => setDrawerOpen(false)} />

      <Animated.View
        style={[
          styles.mainShadow,
          { transform: [{ translateX }] },
        ]}
      >
        <Animated.View style={[styles.mainClip, { borderRadius }]}>
          <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
              <TouchableOpacity hitSlop={12} activeOpacity={0.6} onPress={() => setDrawerOpen(true)}>
                <MenuIcon size={24} />
              </TouchableOpacity>

              <View style={styles.titleCenter} pointerEvents="none">
                <GradientText text="Globin" style={typography.headerTitle} />
              </View>

              <View style={styles.rightActions}>
                <TouchableOpacity hitSlop={10} activeOpacity={0.6}>
                  <PencilIcon size={22} />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10} activeOpacity={0.6}>
                  <DotsIcon size={22} />
                </TouchableOpacity>
              </View>
            </View>

            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <View style={styles.emptyState}>
                <GlobinLogo size={60} />
              </View>

              <ChatInput />
            </KeyboardAvoidingView>
          </SafeAreaView>

          {drawerOpen && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setDrawerOpen(false)}
            />
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  mainClip: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  titleCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginLeft: 'auto',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
