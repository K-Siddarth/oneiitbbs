import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';

export default function ClubScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#EAEAEA', dark: '#2A2A2A' }}
      headerImage={
        <Image
          source={require('@/assets/images/neuro_logo.png')}
          style={styles.headerImage}
          // contentFit="contain" 
        />
      }
      headerHeight={200}
    >
      {/* Club Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Neuromancers</ThemedText>
      </ThemedView>

      {/* Secretary */}
      <ThemedText type="subtitle" style={{ marginTop: 16, textAlign: 'center' }}>Secretary</ThemedText>
      <View style={styles.secCard}>
          <Image source= {require('@/assets/images/profile_image.jpeg')} style={styles.memberPhoto} />
          <ThemedText style={styles.memberName}>Suvansh Sharma</ThemedText>
      </View>

      {/* Governors */}
      <ThemedText type="subtitle" style={{ marginTop: 16, textAlign: 'center' }}>Governors</ThemedText>
      <View style={styles.governorsRow}>
        {[
          { name: 'Aaditya Sharma', photo: require('@/assets/images/profile_image.jpeg') },
          { name: 'Raj Vardhan', photo: require('@/assets/images/profile_image.jpeg') },
          { name: 'K. Siddarth', photo: require('@/assets/images/profile_image.jpeg') },
        ].map((gov, idx) => (
          <View key={idx} style={styles.memberCard}>
            <Image source={gov.photo} style={styles.memberPhoto} />
            <ThemedText style={styles.memberName}>{gov.name}</ThemedText>
          </View>
        ))}
      </View>

      {/* Club Description */}
      <ThemedText type="subtitle" style={{ marginTop: 20 }}>About Us</ThemedText>
      <ThemedText>
        The Tech Innovation Club is a student-led initiative that encourages creativity,
        collaboration, and hands-on learning. Our mission is to build a thriving community
        of innovators who explore new technologies, organize workshops, and represent the
        college at national and international hackathons.
      </ThemedText>

      {/* Upcoming Events */}
      <ThemedText type="subtitle" style={{ marginTop: 20 }}>Upcoming Events</ThemedText>
      <View style={styles.cardsContainer}>
        <Card>
          <ThemedText type="defaultSemiBold">Hackathon 2025</ThemedText>
          <ThemedText>Date: 20th Sept, 2025</ThemedText>
          <ThemedText>Join us for a 24-hour coding marathon with exciting prizes!</ThemedText>
        </Card>
        <Card>
          <ThemedText type="defaultSemiBold">AI Workshop</ThemedText>
          <ThemedText>Date: 5th Oct, 2025</ThemedText>
          <ThemedText>Hands-on session on building AI models using Python.</ThemedText>
        </Card>
      </View>

      {/* Past Events */}
      <ThemedText type="subtitle" style={{ marginTop: 20 }}>Past Events</ThemedText>
      <View style={styles.cardsContainer}>
        <Card>
          <ThemedText type="defaultSemiBold">Hackathon 2025</ThemedText>
          <ThemedText>Date: 20th Sept, 2025</ThemedText>
          <ThemedText>Join us for a 24-hour coding marathon with exciting prizes!</ThemedText>
        </Card>
        <Card>
          <ThemedText type="defaultSemiBold">AI Workshop</ThemedText>
          <ThemedText>Date: 5th Oct, 2025</ThemedText>
          <ThemedText>Hands-on session on building AI models using Python.</ThemedText>
        </Card>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: 140,       
    height: 100,      
    alignSelf: 'center',
    marginTop: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  governorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  secCard: {
    alignItems: 'center',
  },
  memberCard: {
    alignItems: 'center',
    width: 100,
  },
  memberPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 6,
  },
  memberName: {
    textAlign: 'center',
    fontSize: 12,
  },
  cardsContainer: {
    gap: 12,
    marginVertical: 10,
  },
  eventCard: {
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },
});
