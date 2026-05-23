import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc
} from "firebase/firestore";
import { useAuth } from "../../lib/AuthContext";
import { moderateScale, scale, verticalScale } from "../../lib/responsive";
import { db } from "../firebase";

type CalendarEvent = {
  id: string;
  eventName: string;
  venue?: string;
  startTimestamp: string;
  endTimestamp: string;
  society?: string;
  description?: string;
};

const SOCIETIES = ["All", "Aaroh", "Abhivyakti", "Cinewave", "Clix", "DGroovers", "FEBS", "Fourthwall", "Kalakriti", "Nakshatra", "Neuromancers", "Panacea", "RISC", "Souls for Solace", "Webnd"];

export default function CalendarScreen() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("2025-07-14");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [adding, setAdding] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newVenue, setNewVenue] = useState<string>("");
  
  const [newSociety, setNewSociety] = useState<string>("None");
  const [newDescription, setNewDescription] = useState<string>("");

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  const fetchEvents = async (date: string) => {
    setLoading(true);
    try {
      const dateDoc = doc(db, "events", date);
      const eventsCol = collection(dateDoc, "events");
      const snapshot = await getDocs(eventsCol);
      const list: CalendarEvent[] = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<CalendarEvent, "id">),
      }));
      setEvents(list);
    } catch (err) {
      console.log("Error loading events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  const formatHM = (date: Date): string => {
    let h: number | string = date.getHours();
    let m: number | string = date.getMinutes();
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    return `${h}:${m}`;
  };

  const addEvent = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Please enter an event name.");
      return;
    }
    if (!newVenue.trim()) {
      Alert.alert("Error", "Please enter a venue.");
      return;
    }
    const [year, month, day] = selectedDate.split('-').map(Number);
    const startObj = new Date(year, month - 1, day, startTime.getHours(), startTime.getMinutes());
    let endObj = new Date(year, month - 1, day, endTime.getHours(), endTime.getMinutes());

    if (startObj < new Date()) {
      Alert.alert("Error", "Cannot create an event in the past.");
      return;
    }

    if (endObj <= startObj) {
      Alert.alert("Error", "End time must be after start time.");
      return;
    }

    const startTimestamp = startObj.toISOString();
    const endTimestamp = endObj.toISOString();
    const formattedSociety = newSociety === "None" ? "" : newSociety.toLowerCase();

    try {
      const dateDoc = doc(db, "events", selectedDate);
      const eventsCol = collection(dateDoc, "events");
      const docRef = await addDoc(eventsCol, {
        startTimestamp,
        endTimestamp,
        eventName: newName,
        venue: newVenue,
        society: formattedSociety,
        description: newDescription
      });

      if (formattedSociety) {
        const societyEventRef = doc(db, "society_events", docRef.id);
        await setDoc(societyEventRef, {
          title: newName,
          date: startTimestamp, 
          endDate: endTimestamp, // 🔹 Saved so SocietyPage knows when it ends
          description: newDescription || `Venue: ${newVenue}`,
          society: formattedSociety,
          type: 'upcoming'
        });
      }

      setEvents(e => [...e, { 
        id: docRef.id, 
        startTimestamp, 
        endTimestamp, 
        eventName: newName, 
        venue: newVenue,
        society: formattedSociety,
        description: newDescription
      }]);
    } catch (err) {
      console.log("Error adding event:", err);
    }

    setNewName("");
    setNewVenue("");
    setNewSociety("None");
    setNewDescription("");
    setStartTime(new Date());
    setEndTime(new Date());
    setAdding(false);
  };

  const confirmDelete = (item: CalendarEvent) => {
    Alert.alert(
      "Delete Event?",
      `${item.eventName}\n${new Date(item.startTimestamp).toLocaleTimeString()} - ${new Date(item.endTimestamp).toLocaleTimeString()}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            try {
              const dateDoc = doc(db, "events", selectedDate);
              const eventDoc = doc(dateDoc, "events", item.id);
              await deleteDoc(eventDoc);

              const societyEventDoc = doc(db, "society_events", item.id);
              await deleteDoc(societyEventDoc).catch(() => {});

              setEvents(e => e.filter(ev => ev.id !== item.id));
            } catch (err) {
              console.log("Error deleting:", err);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: verticalScale(20) }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (adding) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(40) }}>
          <Text style={styles.header}>New Event on {selectedDate}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Event Name"
              value={newName}
              onChangeText={setNewName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Venue:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Event Venue (e.g. SAC Room 1)"
              value={newVenue}
              onChangeText={setNewVenue}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description (Optional):</Text>
            <TextInput
              style={[styles.textInput, { height: verticalScale(80) }]}
              placeholder="Brief details about the event..."
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Start:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeBox}>
              <Text>{formatHM(startTime)}</Text>
            </TouchableOpacity>
          </View>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="spinner"
              onChange={(e, d) => {
                setShowStartPicker(false);
                if (d) setStartTime(d);
              }}
            />
          )}

          <View style={styles.field}>
            <Text style={styles.label}>End:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeBox}>
              <Text>{formatHM(endTime)}</Text>
            </TouchableOpacity>
          </View>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="spinner"
              onChange={(e, d) => {
                setShowEndPicker(false);
                if (d) setEndTime(d);
              }}
            />
          )}

          {/* 🔹 Society Chips at the bottom */}
          <View style={styles.field}>
            <Text style={styles.label}>Society (Optional):</Text>
            <View style={styles.chipsContainer}>
              {SOCIETIES.map(soc => (
                <TouchableOpacity
                  key={soc}
                  style={[styles.chip, newSociety === soc && styles.chipSelected]}
                  onPress={() => setNewSociety(soc)}
                >
                  <Text style={[styles.chipText, newSociety === soc && styles.chipTextSelected]}>
                    {soc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={addEvent} style={styles.saveBtn}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAdding(false)} style={styles.cancelBtn}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={day => { setSelectedDate(day.dateString); }}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: "blue" } }}
      />

      <FlatList
        data={events.sort((a, b) =>
          new Date(a.startTimestamp).getTime() - new Date(b.startTimestamp).getTime()
        )}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => user?.isAdmin ? confirmDelete(item) : null} // 🔹 Only admin can press to delete
            activeOpacity={user?.isAdmin ? 0.2 : 1} // Disables visual click feedback for non-admins
          >
            <View style={styles.eventBlock}>
              <Text style={styles.eventName}>{item.eventName}</Text>
              {item.venue && <Text style={styles.eventTime}>Venue: {item.venue}</Text>}
              
              {item.society ? <Text style={styles.eventTime}>Society: {item.society}</Text> : null}

              <Text style={styles.eventTime}>
                {new Date(item.startTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(item.endTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: moderateScale(10) }}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: verticalScale(20) }}>No events for this date</Text>}
      />

      {user?.isAdmin && (
        <TouchableOpacity style={styles.fab} onPress={() => setAdding(true)}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  fab: {
    position: "absolute", bottom: verticalScale(30), right: scale(30),
    backgroundColor: "#007BFF", width: moderateScale(60), height: moderateScale(60), borderRadius: moderateScale(30),
    justifyContent: "center", alignItems: "center", elevation: 5
  },
  fabText: { fontSize: moderateScale(30), color: "white" },

  eventBlock: {
    backgroundColor: "#add8e6", marginVertical: verticalScale(5), padding: moderateScale(10), borderRadius: moderateScale(5)
  },
  eventName: { fontWeight: "bold", fontSize: moderateScale(14) },
  eventTime: { color: "#333", fontSize: moderateScale(12), marginTop: verticalScale(2) },

  header: { fontSize: moderateScale(20), fontWeight: "bold", margin: moderateScale(10) },
  field: { marginHorizontal: scale(10), marginVertical: verticalScale(5) },
  label: { marginBottom: verticalScale(4), fontSize: moderateScale(14), fontWeight: '500' },
  textInput: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: moderateScale(4), padding: moderateScale(8), fontSize: moderateScale(14), backgroundColor: "#fff"
  },
  timeBox: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: moderateScale(4),
    padding: moderateScale(12), alignItems: "center", backgroundColor: "#fff"
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginTop: verticalScale(4),
  },
  chip: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(16),
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  chipText: {
    fontSize: moderateScale(12),
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },

  buttonRow: {
    flexDirection: "row", justifyContent: "space-around", marginTop: verticalScale(20), paddingHorizontal: scale(10)
  },
  saveBtn: {
    backgroundColor: "#28a745", padding: moderateScale(12), borderRadius: moderateScale(6), flex: 1, marginHorizontal: scale(5), alignItems: "center"
  },
  cancelBtn: {
    backgroundColor: "#dc3545", padding: moderateScale(12), borderRadius: moderateScale(6), flex: 1, marginHorizontal: scale(5), alignItems: "center"
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: moderateScale(14) }
});