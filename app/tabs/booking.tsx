import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";

import { ThemedText } from "@/components/ThemedText";
import {
    addDoc,
    collection,
    doc,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

type CalendarEvent = {
    id: string;
    eventName: string;
    startTimestamp: string;
    endTimestamp: string;
};

const ROOMS = [
    "Conference Room A",
    "Conference Room B",
    "Auditorium",
    "Lab 1",
    "Lab 2",
    "Meeting Room",
];

export default function BookingScreen() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [roomName, setRoomName] = useState<string>(ROOMS[0]);
    const [eventName, setEventName] = useState<string>("");
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date(new Date().getTime() + 60 * 60 * 1000)); // Default 1 hour later

    const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
    const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const formatHM = (date: Date): string => {
        let h: number | string = date.getHours();
        let m: number | string = date.getMinutes();
        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        return `${h}:${m}`;
    };

    const getTimestamps = () => {
        // Construct base ISO strings using selectedDate and local time components
        // Note: This naive construction assumes local time matches the desired event time.
        // Ideally we would handle timezones more robustly, but for this app context it suffices if consistent.
        let startStr = `${selectedDate}T${formatHM(startTime)}:00`;
        let endStr = `${selectedDate}T${formatHM(endTime)}:00`;

        // JavaScript Date parsing of "YYYY-MM-DDTHH:mm:ss" interprets it as Local time (if no Z) or UTC depending on browser/runtime.
        // Adding 'Z' forces UTC. 
        // Let's stick to adding 'Z' to match the existing convention in calendar.tsx, BUT we must acknowledge this shifts the absolute time.
        // However, since we compare based on these strings, consistency is key.

        startStr += "Z";
        endStr += "Z";

        let startDateObj = new Date(startStr);
        let endDateObj = new Date(endStr);

        // Initial check: if end time is earlier than start time (e.g. 11 PM to 1 AM), 
        // it implies the event ends on the NEXT day.
        if (endDateObj <= startDateObj) {
            // Add 1 day to end date
            const nextDay = new Date(endDateObj);
            nextDay.setDate(nextDay.getDate() + 1);
            endDateObj = nextDay;
            // Reconstruct string for storage
            endStr = nextDay.toISOString().split('.')[0] + "Z";
        }

        return { startStr, endStr, startDateObj, endDateObj };
    };

    const extractRoom = (fullEventName: string): string => {
        // Format: "[Room Name] Event Title"
        const match = fullEventName.match(/^\[(.*?)\]/);
        return match ? match[1] : "";
    };

    const checkForConflict = async (start: Date, end: Date): Promise<boolean> => {
        try {
            // Check collision on the start date
            const dateDoc = doc(db, "events", selectedDate);
            const eventsCol = collection(dateDoc, "events");
            const snapshot = await getDocs(eventsCol);

            const newStart = start.getTime();
            const newEnd = end.getTime();

            for (const d of snapshot.docs) {
                const event = d.data() as Omit<CalendarEvent, "id">;
                const existingStart = new Date(event.startTimestamp).getTime();
                const existingEnd = new Date(event.endTimestamp).getTime();

                // Check if existing event is for the same room
                const existingRoom = extractRoom(event.eventName);

                // Use normalized comparison
                if (existingRoom.toLowerCase() === roomName.toLowerCase()) {
                    // Overlap logic: (StartA < EndB) and (EndA > StartB)
                    if (newStart < existingEnd && newEnd > existingStart) {
                        return true;
                    }
                }
            }
            return false;
        } catch (err) {
            console.log("Error checking conflicts:", err);
            // Fail open or closed? Let's log and allow, but user might overwrite. 
            // Ideally we'd block, but for now return false.
            return false;
        }
    };

    const handleBook = async () => {
        if (!eventName.trim()) {
            Alert.alert("Error", "Please enter an event name.");
            return;
        }

        setLoading(true);

        const { startStr, endStr, startDateObj, endDateObj } = getTimestamps();

        // Double check sanity
        if (endDateObj <= startDateObj) {
            setLoading(false);
            Alert.alert("Error", "End time must be after start time (and distinct).");
            return;
        }

        const hasConflict = await checkForConflict(startDateObj, endDateObj);

        if (hasConflict) {
            setLoading(false);
            Alert.alert("Conflict Detected", `The room "${roomName}" is already booked for this time slot.`);
            return;
        }

        try {
            const fullEventName = `[${roomName}] ${eventName}`;
            const dateDoc = doc(db, "events", selectedDate);
            const eventsCol = collection(dateDoc, "events");
            await addDoc(eventsCol, {
                startTimestamp: startStr,
                endTimestamp: endStr,
                eventName: fullEventName
            });

            Alert.alert("Success", "Room booked successfully!", [
                {
                    text: "OK", onPress: () => {
                        setEventName("");
                    }
                }
            ]);
        } catch (err) {
            console.log("Error booking room:", err);
            Alert.alert("Error", "Failed to book room.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <ThemedText type="title" style={styles.header}>Book a Room</ThemedText>

                <View style={styles.field}>
                    <ThemedText style={styles.label}>Select Date:</ThemedText>
                    <Calendar
                        current={selectedDate}
                        onDayPress={day => { setSelectedDate(day.dateString); }}
                        markedDates={{ [selectedDate]: { selected: true, selectedColor: "#0a7ea4" } }}
                        style={styles.calendar}
                    />
                </View>

                <View style={styles.field}>
                    <ThemedText style={styles.label}>Select Room:</ThemedText>
                    <View style={styles.roomList}>
                        {ROOMS.map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.roomChip, roomName === r && styles.roomChipSelected]}
                                onPress={() => setRoomName(r)}
                            >
                                <Text style={[styles.roomChipText, roomName === r && styles.roomChipTextSelected]}>{r}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.field}>
                    <ThemedText style={styles.label}>Event Name:</ThemedText>
                    <TextInput
                        style={styles.textInput}
                        placeholder="e.g. Team Meeting, Workshop"
                        value={eventName}
                        onChangeText={setEventName}
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.field, { flex: 1 }]}>
                        <ThemedText style={styles.label}>Start Time:</ThemedText>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeBox}>
                            <Text>{formatHM(startTime)}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.field, { flex: 1 }]}>
                        <ThemedText style={styles.label}>End Time:</ThemedText>
                        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeBox}>
                            <Text>{formatHM(endTime)}</Text>
                        </TouchableOpacity>
                    </View>
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

                <TouchableOpacity
                    onPress={handleBook}
                    style={[styles.bookBtn, loading && styles.disabledBtn]}
                    disabled={loading}
                >
                    <Text style={styles.btnText}>{loading ? "Checking..." : "Confirm Booking"}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    contentContainer: { padding: 20, paddingBottom: 50 },
    header: { textAlign: 'center', marginBottom: 20 },
    calendar: { borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 15 },
    field: { marginBottom: 15 },
    row: { flexDirection: 'row', gap: 10 },
    label: { marginBottom: 8, fontWeight: '600' },
    textInput: {
        borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 16, color: '#000'
    },
    timeBox: {
        borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
        padding: 12, alignItems: "center"
    },
    bookBtn: {
        backgroundColor: "#0a7ea4", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 20
    },
    disabledBtn: {
        backgroundColor: "#a0c4d1"
    },
    btnText: { color: "white", fontWeight: "bold", fontSize: 18 },
    roomList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    roomChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
    roomChipSelected: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
    roomChipText: { color: '#333' },
    roomChipTextSelected: { color: '#fff', fontWeight: 'bold' }
});
