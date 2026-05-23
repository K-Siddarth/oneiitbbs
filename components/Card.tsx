// components/Card.tsx
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { moderateScale, scale, verticalScale } from '@/lib/responsive';

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    shadowOffset: { width: 0, height: verticalScale(2) },
    elevation: 3, // Android shadow
    marginVertical: verticalScale(6),
  },
});
