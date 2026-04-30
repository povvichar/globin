import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

type Props = {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
};

export const SocialButton = ({ label, icon, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    //borderWidth: 1,
    //borderColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 24,
    height: 56,
    marginBottom: 10,
    gap: 12,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.button,
    color: colors.textPrimary,
  },
});
