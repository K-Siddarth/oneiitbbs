import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../lib/AuthContext';
import { moderateScale, scale, verticalScale } from "../../lib/responsive";

const TECH_SOCIETIES = [
  { name: 'Neuromancers', route: '/societies/neuro' },
  { name: 'Webnd', route: '/societies/webnd' },
  { name: 'Nakshatra', route: '/societies/nakshatra' },
  { name: 'FEBS', route: '/societies/febs' },
  { name: 'RISC', route: '/societies/risc' },
];

const SOCIO_CULTURAL_SOCIETIES = [
  { name: 'Kalakriti', route: '/societies/kalakriti' },
  { name: 'Aaroh', route: '/societies/aaroh' },
  { name: 'D Groovers', route: '/societies/dgroovers' },
  { name: 'Fourth Wall', route: '/societies/fourthwall' },
  { name: 'Panacea', route: '/societies/panacea' },
  { name: 'Abhivyakti', route: '/societies/abhivyakti' },
  { name: 'Cinewave', route: '/societies/cinewave' },
  { name: 'Clix', route: '/societies/clix' },
  { name: 'Souls for Solace', route: '/societies/soulsforsolace' },
];

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleLogout = () => {
    setProfileModalVisible(false);
    logout();
  };

  const navigateToSociety = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile</Text>
            <Text style={styles.modalLabel}>Name</Text>
            <Text style={styles.modalValue}>{user?.displayName}</Text>
            <Text style={styles.modalLabel}>Email</Text>
            <Text style={styles.modalValue}>{user?.email}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setProfileModalVisible(false)}>
              <Text style={styles.modalButtonSecondaryText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerBar}>
          <TouchableOpacity 
            onPress={() => setProfileModalVisible(true)}
            style={styles.profileImageContainer}
          >
            <Image 
              source={require('@/assets/images/profile_image.jpeg')} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
          <Text style={styles.appTitle}>One IITBBS App</Text>
          <View style={styles.profilePlaceholder} />
        </View>

        <View style={styles.content}>
          <Text style={styles.welcome}>Welcome to IIT BBS</Text>
          {/* <Text style={styles.subtitle}>Gymkhana Hub</Text> */}

          {/* Tech Societies Section */}
          <View style={styles.societiesSection}>
            <Text style={styles.sectionTitle}>Tech Societies</Text>
            <View style={styles.societiesGrid}>
              {TECH_SOCIETIES.map((society, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.societyCard}
                  onPress={() => navigateToSociety(society.route)}
                > 
                  <Text style={styles.societyName}>{society.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Socio Cultural Societies Section */}
          <View style={styles.societiesSection}>
            <Text style={styles.sectionTitle}>Socio Cultural Societies</Text>
            <View style={styles.societiesGrid}>
              {SOCIO_CULTURAL_SOCIETIES.map((society, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.societyCard}
                  onPress={() => navigateToSociety(society.route)}
                >
                  <Text style={styles.societyName}>{society.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20), // Added slight padding at bottom for smooth scrolling
  },
  content: {
    flex: 1,
    padding: moderateScale(20),
  },
  welcome: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(18),
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(40),
  },
  userInfo: {
    backgroundColor: 'white',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  userLabel: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    marginTop: verticalScale(10),
  },
  userValue: {
    fontSize: moderateScale(16),
    color: '#666',
    marginBottom: verticalScale(5),
  },
  adminBadge: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  userBadge: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  societiesSection: {
    backgroundColor: 'white',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(30),
    // marginTop: verticalScale(200),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  societiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  societyCard: {
    backgroundColor: '#f8f9fa',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(10),
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  societyName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
    backgroundColor: '#007BFF',
  },
  profileButtonText: {
    color: 'white',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  profileImageContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
  },
  profilePlaceholder: {
    width: scale(70),
  },
  appTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: moderateScale(24),
    borderRadius: moderateScale(12),
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(16),
  },
  modalLabel: {
    fontSize: moderateScale(14),
    color: '#888',
    marginTop: verticalScale(8),
  },
  modalValue: {
    fontSize: moderateScale(16),
    color: '#333',
    fontWeight: '500',
    marginBottom: verticalScale(8),
  },
  modalButton: {
    marginTop: verticalScale(16),
    width: '100%',
    backgroundColor: '#dc3545',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  modalButtonSecondary: {
    marginTop: verticalScale(12),
    width: '100%',
    borderWidth: 1,
    borderColor: '#007bff',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: '#007bff',
    fontWeight: '600',
  },
});