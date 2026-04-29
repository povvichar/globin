import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  title: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  headerTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
  },
  button: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
  },
  caption: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
  },
};
