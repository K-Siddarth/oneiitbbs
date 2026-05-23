import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <BlurView
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  try {
    const height = useBottomTabBarHeight();
    return height ?? 0;
  } catch {
    // Non-bottom-tab screens (e.g. society pages) do not have tab bar height context.
    return 0;
  }
}
