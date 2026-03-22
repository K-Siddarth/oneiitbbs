import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";

import {
  addDoc,
  collection,
  deleteDoc, doc,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

type CalendarEvent = {
  id: string;
  eventName: string;
  startTimestamp: string;
  endTimestamp: string;
};

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string>("2025-07-14");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [adding, setAdding] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  // 🔹 Load events for selectedDate from Firestore
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

  // Reload when date changes
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

  // 🔹 Add event to Firestore (subcollection of selected date)
  const addEvent = async () => {
    if (!newName.trim()) return;
    const start = formatHM(startTime), end = formatHM(endTime);
    const startTimestamp = `${selectedDate}T${start}:00Z`;
    const endTimestamp = `${selectedDate}T${end}:00Z`;

    try {
      const dateDoc = doc(db, "events", selectedDate);
      const eventsCol = collection(dateDoc, "events");
      const docRef = await addDoc(eventsCol, {
        startTimestamp,
        endTimestamp,
        eventName: newName
      });
      setEvents(e => [...e, { id: docRef.id, startTimestamp, endTimestamp, eventName: newName }]);
    } catch (err) {
      console.log("Error adding event:", err);
    }

    setNewName("");
    setStartTime(new Date());
    setEndTime(new Date());
    setAdding(false);
  };

  // 🔹 Delete event from Firestore
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
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // 🔹 Add screen
  if (adding) {
    return (
      <SafeAreaView style={styles.container}>
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
          <Text style={styles.label}>Start:</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeBox}>
            <Text>{formatHM(startTime)}</Text>
          </TouchableOpacity>
        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
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
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, d) => {
              setShowEndPicker(false);
              if (d) setEndTime(d);
            }}
          />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={addEvent} style={styles.saveBtn}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAdding(false)} style={styles.cancelBtn}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 🔹 Main screen
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
          <TouchableOpacity onPress={() => confirmDelete(item)}>
            <View style={styles.eventBlock}>
              <Text style={styles.eventName}>{item.eventName}</Text>
              <Text style={styles.eventTime}>
                {new Date(item.startTimestamp).toLocaleTimeString()} – {new Date(item.endTimestamp).toLocaleTimeString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No events for this date</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setAdding(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: {
    position: "absolute", bottom: 30, right: 30,
    backgroundColor: "#007BFF", width: 60, height: 60, borderRadius: 30,
    justifyContent: "center", alignItems: "center", elevation: 5
  },
  fabText: { fontSize: 30, color: "white" },

  eventBlock: {
    backgroundColor: "#add8e6", marginVertical: 5, padding: 10, borderRadius: 5
  },
  eventName: { fontWeight: "bold" },
  eventTime: { color: "#333" },

  header: { fontSize: 20, fontWeight: "bold", margin: 10 },
  field: { marginHorizontal: 10, marginVertical: 5 },
  label: { marginBottom: 4 },
  textInput: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8
  },
  timeBox: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 4,
    padding: 12, alignItems: "center"
  },

  buttonRow: {
    flexDirection: "row", justifyContent: "space-around", marginTop: 20
  },
  saveBtn: {
    backgroundColor: "#28a745", padding: 12, borderRadius: 6, flex: 1, marginHorizontal: 5, alignItems: "center"
  },
  cancelBtn: {
    backgroundColor: "#dc3545", padding: 12, borderRadius: 6, flex: 1, marginHorizontal: 5, alignItems: "center"
  },
  btnText: { color: "white", fontWeight: "bold" }
});
