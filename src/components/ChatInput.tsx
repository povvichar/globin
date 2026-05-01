import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AddSquareIcon, MicIcon, SendIcon } from './Icons';
import { colors, gradients } from '../constants/colors';

export const ChatInput = () => {
  const [value, setValue] = useState('');

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Chat with Globin..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={value}
        onChangeText={setValue}
        multiline
      />

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.squareBtn} activeOpacity={0.7}>
          <AddSquareIcon size={24} />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <MicIcon size={24} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendBtn}
            >
              <SendIcon size={18} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: 26,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 6,
    minHeight: 40,
    maxHeight: 120,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  squareBtn: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
