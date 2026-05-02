import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ChatInput } from '../components/ChatInput';
import { Drawer } from '../components/Drawer';
import { GlobinLogo } from '../components/GlobinLogo';
import { GradientText } from '../components/GradientText';
import { CopyIcon, DeleteIcon, DotsIcon, LoadingIcon, MenuIcon, PencilIcon, ShareIcon, SpeakerIcon, ThumbDownIcon, ThumbUpIcon } from '../components/Icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.botRow}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <LoadingIcon size={20} />
      </Animated.View>
    </View>
  );
};

const ChatOptionsMenu = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 14,
          stiffness: 340,
          mass: 0.6,
        }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.85, duration: 130, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 130, useNativeDriver: true }),
      ]).start(() => setMounted(false));
    }
  }, [visible]);

  if (!mounted) return null;

  const menuHeight = 156;

  return (
    <Modal transparent animationType="none" visible={mounted} onRequestClose={onClose}>
      <Pressable style={styles.menuBackdrop} onPress={onClose}>
        <Animated.View style={[styles.menuContainer, {
          opacity: opacityAnim,
          transform: [
            { translateY: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [-menuHeight / 2, 0] }) },
            { scaleX: scaleAnim },
            { scaleY: scaleAnim },
          ],
        }]}>
          <BlurView intensity={70} tint="light" style={styles.menuBlur}>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} activeOpacity={0.7} onPress={onClose}>
              <ShareIcon size={20} />
              <Text style={styles.menuItemText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} activeOpacity={0.7} onPress={onClose}>
              <PencilIcon size={20} />
              <Text style={styles.menuItemText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={onClose}>
              <DeleteIcon size={20} />
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>Delete</Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const MessageBubble = ({ message }: { message: Message }) => {
  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.botRow}>
      <View style={styles.botContent}>
        <Text style={styles.botText}>{message.text}</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity hitSlop={8} activeOpacity={0.6}><CopyIcon size={18} /></TouchableOpacity>
          <TouchableOpacity hitSlop={8} activeOpacity={0.6}><ThumbUpIcon size={18} /></TouchableOpacity>
          <TouchableOpacity hitSlop={8} activeOpacity={0.6}><ThumbDownIcon size={18} /></TouchableOpacity>
          <TouchableOpacity hitSlop={8} activeOpacity={0.6}><ShareIcon size={18} /></TouchableOpacity>
          <TouchableOpacity hitSlop={8} activeOpacity={0.6}><DotsIcon size={18} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const ChatScreen = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
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

    if (messages.length === 0) {
      const words = text.trim().split(/\s+/).slice(0, 5).join(' ');
      setConversationTitle(words.length < text.trim().length ? words + '…' : words);
    }

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
    }, 1800 + Math.random() * 1200);
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
                {conversationTitle ? (
                  <Text style={styles.topicTitle} numberOfLines={1}>{conversationTitle}</Text>
                ) : (
                  <GradientText text="Globin" style={typography.headerTitle}/>
                )}
              </View>

              <View style={styles.rightActions}>
                {!showEmptyState && (
                  <>
                    <TouchableOpacity hitSlop={10} activeOpacity={0.6} onPress={() => { setMessages([]); setConversationTitle(null); }}>
                      <PencilIcon size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity hitSlop={10} activeOpacity={0.6} onPress={() => setMenuVisible(true)}>
                      <DotsIcon size={24} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              {showEmptyState ? (
                <View style={styles.emptyState}>
                  <GlobinLogo size={60} />
                  <Text style={styles.emptyTitle}></Text>
                  <Text style={styles.emptySubtitle}></Text>
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

      <ChatOptionsMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
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
    left: 60,
    right: 60,
    alignItems: 'center',
  },
  topicTitle: {
    ...typography.headerTitle,
    fontSize: 16,
    color: colors.textPrimary,
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
    alignItems: 'flex-start',
    gap: 10,
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
  userBubble: {
    maxWidth: SCREEN_WIDTH * 0.72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    backgroundColor: '#EBEBEB',
  },
  botContent: {
    flex: 1,
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  botText: {
    ...typography.body,
    color: colors.textPrimary,
    paddingTop: 4,
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
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  menuBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  menuItemDanger: {
    color: '#E53935',
  },
});
