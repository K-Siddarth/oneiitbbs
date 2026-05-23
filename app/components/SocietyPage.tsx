import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { moderateScale, scale, verticalScale } from "../../lib/responsive";
import { db } from "../firebase";

type SocietyEvent = {
  id: string;
  title: string;
  date: string;
  endDate?: string; // 🔹 Added endDate to calculate if event is over
  description: string;
  society: string;
  type: 'upcoming' | 'past';
};

interface SocietyPageProps {
  societyName: string;
  logoSource: any;
  secretary: {
    name: string;
    photo: any;
  };
  governors: {
    name: string;
    photo: any;
  }[];
  aboutText: string;
  backgroundColor?: { light: string; dark: string };
}

export default function SocietyPage({
  societyName,
  logoSource,
  secretary,
  governors,
  aboutText,
  backgroundColor = { light: '#EAEAEA', dark: '#EAEAEA' }
}: SocietyPageProps) {
  const [upcomingEvents, setUpcomingEvents] = useState<SocietyEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<SocietyEvent[]>([]);

  const fetchSocietyEvents = useCallback(async () => {
    try {
      const eventsRef = collection(db, 'society_events');
      const q = query(eventsRef, where('society', '==', societyName.toLowerCase()));
      const snapshot = await getDocs(q);

      const events: SocietyEvent[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SocietyEvent));

      const now = new Date();
      
      // 🔹 Separate upcoming and past events based on endDate
      const upcoming = events.filter(event => {
        const endTime = event.endDate ? new Date(event.endDate) : new Date(event.date);
        return endTime >= now && event.type !== 'past'; // Ongoing or in the future
      });
      
      const past = events.filter(event => {
        const endTime = event.endDate ? new Date(event.endDate) : new Date(event.date);
        return endTime < now || event.type === 'past'; // Officially over
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error('Error fetching society events:', error);
    }
  }, [societyName]);

  useEffect(() => {
    fetchSocietyEvents();
  }, [fetchSocietyEvents]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={backgroundColor}
      headerImage={
        <Image
          source={logoSource}
          style={styles.headerImage}
        />
      }
      headerHeight={200}
    >
      <View style={styles.watermarkContainer}>
        <Image
          source={logoSource}
          contentFit="contain"
          style={styles.watermark}
          transition={100}
        />
        <View style={styles.pageContent}>
          {/* Society Title */}
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{societyName}</ThemedText>
          </ThemedView>

          {/* Secretary */}
          <ThemedText type="subtitle" style={{ marginTop: verticalScale(16), textAlign: 'center' }}>Secretary</ThemedText>
          <View style={styles.secCard}>
            <Image 
              source={secretary.photo} 
              style={styles.memberPhoto}
              contentFit="cover"
              transition={200}
            />
            <ThemedText style={styles.memberName}>{secretary.name}</ThemedText>
          </View>

          {/* Governors */}
          <ThemedText type="subtitle" style={{ marginTop: verticalScale(16), textAlign: 'center' }}>Governors</ThemedText>
          <View style={styles.governorsRow}>
            {governors.map((gov, idx) => (
              <View key={idx} style={styles.memberCard}>
                <Image 
                  source={gov.photo} 
                  style={styles.memberPhoto}
                  contentFit="cover"
                  transition={200}
                />
                <ThemedText style={styles.memberName}>{gov.name}</ThemedText>
              </View>
            ))}
          </View>

          {/* About Section */}
          <ThemedText type="subtitle" style={{ marginTop: verticalScale(20) }}>About Us</ThemedText>
          <ThemedText>{aboutText}</ThemedText>

          {/* Upcoming Events */}
          <ThemedText type="subtitle" style={{ marginTop: verticalScale(20) }}>Upcoming Events</ThemedText>
          <View style={styles.cardsContainer}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <ThemedText type="defaultSemiBold">{event.title}</ThemedText>
                  <ThemedText>Date: {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</ThemedText>
                  <ThemedText>{event.description}</ThemedText>
                </Card>
              ))
            ) : (
              <Card>
                <ThemedText>No upcoming events scheduled.</ThemedText>
              </Card>
            )}
          </View>

          {/* Past Events */}
          <ThemedText type="subtitle" style={{ marginTop: verticalScale(20) }}>Past Events</ThemedText>
          <View style={styles.cardsContainer}>
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <Card key={event.id}>
                  <ThemedText type="defaultSemiBold">{event.title}</ThemedText>
                  <ThemedText>Date: {new Date(event.date).toLocaleDateString()}</ThemedText>
                  <ThemedText>{event.description}</ThemedText>
                </Card>
              ))
            ) : (
              <Card>
                <ThemedText>No past events to show.</ThemedText>
              </Card>
            )}
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  watermarkContainer: {
    flex: 1,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    top: '15%',
    left: '15%',
    opacity: 0.08,
    zIndex: 0,
  },
  pageContent: {
    position: 'relative',
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  governorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
    flexWrap: 'wrap',
  },
  memberCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    alignItems: 'center',
    width: scale(100),
    marginHorizontal: scale(8),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  memberPhoto: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    marginBottom: verticalScale(8),
  },
  memberName: {
    fontSize: moderateScale(12),
    textAlign: 'center',
    fontWeight: '500',
  },
  cardsContainer: {
    gap: moderateScale(16),
    marginHorizontal: scale(16),
  },
});