import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  TextInput,           // ← add this
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "react-native-calendars";

export default function App() {
  const [selectedDate, setSelectedDate] = useState("2025-07-14");
  const [events, setEvents] = useState([
    { id: 1, startTimestamp: "2025-07-14T21:00:00Z", endTimestamp: "2025-07-14T23:00:00Z", eventName: "Work Block 1" },
    { id: 2, startTimestamp: "2025-07-14T23:00:00Z", endTimestamp: "2025-07-15T00:00:00Z", eventName: "Work Block 2" }
  ]);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const dailyEvents = events.filter(e => e.startTimestamp.startsWith(selectedDate));

  const formatHM = date => {
    let h = date.getHours(), m = date.getMinutes();
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    return `${h}:${m}`;
  };

  const addEvent = () => {
    if (!newName.trim()) return;
    const id = events.length + 1;
    const start = formatHM(startTime), end = formatHM(endTime);
    const startTimestamp = `${selectedDate}T${start}:00Z`;
    const endTimestamp = `${selectedDate}T${end}:00Z`;

    setEvents(e => [...e, { id, startTimestamp, endTimestamp, eventName: newName }]);
    // reset
    setNewName("");
    setStartTime(new Date());
    setEndTime(new Date());
    setAdding(false);
  };

  const confirmDelete = item => {
    Alert.alert(
      "Delete Event?",
      `${item.eventName}\n${new Date(item.startTimestamp).toLocaleTimeString()} - ${new Date(item.endTimestamp).toLocaleTimeString()}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: () => {
            setEvents(e => e.filter(ev => ev.id !== item.id));
          }
        }
      ]
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={day => { setSelectedDate(day.dateString); }}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: "blue" } }}
      />

      <FlatList
        data={dailyEvents}
        keyExtractor={i => i.id.toString()}
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

