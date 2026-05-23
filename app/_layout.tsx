import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ImageBackground, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '../lib/AuthContext';

import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'signin';

        if (!user && !inAuthGroup) {
            router.replace('/signin');
        } else if (user && inAuthGroup) {
            router.replace('/tabs');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ImageBackground 
            source={require('../assets/images/iitbbs_logo.png')} 
            style={styles.backgroundImage} 
            imageStyle={styles.imageStyle}
        >
            <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
                <Stack.Screen name="tabs" options={{ headerShown: false }} />
                <Stack.Screen name="signin" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ contentStyle: { backgroundColor: 'transparent' } }} />
            </Stack>
        </ImageBackground>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <ThemeProvider value={DefaultTheme}>
                        <RootLayoutNav />
                        <StatusBar style="auto" />
                    </ThemeProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageStyle: {
    opacity: 0.1,
    resizeMode: 'contain',
  }
});
