import type { PropsWithChildren, ReactElement } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { moderateScale, scale, verticalScale } from '@/lib/responsive';

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  headerHeight?: number;
}>;

const DEFAULT_HEADER_HEIGHT = 250;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
  headerHeight = DEFAULT_HEADER_HEIGHT,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <View
          style={[
            { height: headerHeight },
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
          ]}>
          {headerImage}
        </View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: moderateScale(32),
    gap: moderateScale(16),
    overflow: 'hidden',
  },

});
