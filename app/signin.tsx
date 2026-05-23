import { useCallback, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/AuthContext';
import { moderateScale, scale, verticalScale } from '../lib/responsive';

export default function SignInScreen() {
  const { signIn, devSignIn, loading } = useAuth();
  const [showDevOption, setShowDevOption] = useState(false);
  
  // Only show dev options in development mode (Expo Go), not in production builds
  const isDevelopment = __DEV__;
  
  const handleSignIn = useCallback(async () => {
    try {
      await signIn();
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Failed to sign in');
    }
  }, [signIn]);

  const handleDevSignIn = useCallback(async () => {
    try {
      await devSignIn();
    } catch (error: any) {
      Alert.alert('Dev Sign In Error', error.message || 'Failed to sign in');
    }
  }, [devSignIn]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to One IITBBS App</Text>

        <TouchableOpacity
          style={[styles.signInButton, loading && styles.disabledButton]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing In...' : 'Sign In with Google'}
          </Text>
        </TouchableOpacity>

        {/* Dev Options - Only show in development mode, not in production builds */}
        {isDevelopment && (
          <>
            <TouchableOpacity
              style={styles.devToggle}
              onPress={() => setShowDevOption(!showDevOption)}
            >
              <Text style={styles.devToggleText}>⚙️ Dev Options</Text>
            </TouchableOpacity>

            {showDevOption && (
              <TouchableOpacity
                style={[styles.devSignInButton, loading && styles.disabledButton]}
                onPress={handleDevSignIn}
                disabled={loading}
              >
                <Text style={styles.devSignInButtonText}>
                  {loading ? 'Signing In...' : 'Dev Sign In (Test Mode)'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(60),
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: scale(40),
    paddingVertical: verticalScale(18),
    borderRadius: moderateScale(12),
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(6),
    elevation: 8,
    borderWidth: 1,
    borderColor: '#357ae8',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  signInButtonText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  devToggle: {
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  devToggleText: {
    color: '#666',
    fontSize: moderateScale(14),
    fontWeight: '500',
    textAlign: 'center',
  },
  devSignInButton: {
    backgroundColor: '#666',
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    width: '80%',
    alignItems: 'center',
    marginTop: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: 4,
  },
  devSignInButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});