import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { gradients } from '../constants/colors';

type Props = {
  text: string;
  style?: TextStyle;
};

export const GradientText = ({ text, style }: Props) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, styles.maskText]}>{text}</Text>
      }
    >
      <LinearGradient
        colors={gradients.brand}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <Text style={[style, styles.hiddenText]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  maskText: {
    backgroundColor: 'transparent',
  },
  hiddenText: {
    opacity: 0,
  },
});
