import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../components/ChatInput';
import { Drawer } from '../components/Drawer';
import { GlobinLogo } from '../components/GlobinLogo';
import { GradientText } from '../components/GradientText';
import { DotsIcon, MenuIcon, PencilIcon } from '../components/Icons';
import { colors, gradients } from '../constants/colors';
import { typography } from '../constants/typography';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PEEK_WIDTH = 70;
const SLIDE_DISTANCE = SCREEN_WIDTH - PEEK_WIDTH;

type Message = {
  id: string;
  text: string;
  role: 'user' | 'bot';
  timestamp: Date;
};

const BOT_RESPONSES = [
  'នោះជាសំណួរដ៏ល្អ! ខ្ញុំកំពុងស្វែងយល់ពីវា។ (That\'s a great question! I\'m exploring that for you.)',
  'ខ្ញុំអាចជួយអ្នកបាន! សូមមើលព័ត៌មានខាងក្រោម។ (I can help with that! Here\'s what I found.)',
  'ថ្ងៃនេះអ្នកត្រូវការជំនួយអ្វី? (What do you need help with today?)',
  'ជាការពិតណាស់! Globin នៅទីនេះដើម្បីជួយអ្នក។ (Absolutely! Globin is here to help you.)',
  'ខ្ញុំបានយល់ពីសំណួររបស់អ្នក។ នេះគឺជាចម្លើយ: (I understand your question. Here\'s the answer:) The information you\'re looking for is quite interesting!',
  'Great question! Based on what I know, I\'d suggest exploring this topic further. There are many perspectives to consider.',
  'I\'m thinking about your question... Here\'s my take: it really depends on the context and what you\'re trying to achieve.',
  'That\'s fascinating! Let me share some insights that might help you with that.',
  'ខ្ញុំស្វែងយល់ពីបញ្ហានេះ។ (I\'m researching this issue.) Here\'s what I can tell you right now.',
  'Of course! I\'d be happy to help. The key thing to remember here is to approach it step by step.',
];

function getRandomResponse(): string {
  return BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
}

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
  });

  return (
    <View style={styles.botRow}>
      <View style={styles.botAvatar}>
        <GlobinLogo size={24} />
      </View>
      <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
        <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
        <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
        <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
      </View>
    </View>
  );
};

const MessageBubble = ({ message }: { message: Message }) => {
  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble]}
        >
          <Text style={styles.userText}>{message.text}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.botRow}>
      <View style={styles.botAvatar}>
        <GlobinLogo size={24} />
      </View>
      <View style={[styles.bubble, styles.botBubble]}>
        <Text style={styles.botText}>{message.text}</Text>
      </View>
    </View>
  );
};

export const ChatScreen = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const radiusAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

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

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(),
        role: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const showEmptyState = messages.length === 0 && !isTyping;

  return (
    <View style={styles.root}>
      <Drawer onClose={() => setDrawerOpen(false)} />

      <Animated.View style={[styles.mainShadow, { transform: [{ translateX }] }]}>
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
                <TouchableOpacity hitSlop={10} activeOpacity={0.6} onPress={() => setMessages([])}>
                  <PencilIcon size={24} />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={10} activeOpacity={0.6}>
                  <DotsIcon size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              {showEmptyState ? (
                <View style={styles.emptyState}>
                  <GlobinLogo size={64} />
                  <Text style={styles.emptyTitle}>How can I help you?</Text>
                  <Text style={styles.emptySubtitle}>Ask me anything in Khmer or English</Text>
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => <MessageBubble message={item} />}
                  contentContainerStyle={styles.messageList}
                  ListFooterComponent={isTyping ? <TypingIndicator /> : null}
                  showsVerticalScrollIndicator={false}
                />
              )}

              <ChatInput onSend={handleSend} />
            </KeyboardAvoidingView>
          </SafeAreaView>

          {drawerOpen && (
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setDrawerOpen(false)} />
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
    gap: 12,
  },
  emptyTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bubble: {
    maxWidth: SCREEN_WIDTH * 0.72,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  userText: {
    ...typography.body,
    color: colors.white,
  },
  botText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.textMuted,
  },
});
