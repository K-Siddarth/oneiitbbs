import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from "@/components/ThemedText";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    where,
    Timestamp,
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import { useAuth } from "../../lib/AuthContext";
import { moderateScale, scale, verticalScale } from "../../lib/responsive";
import { db } from "../firebase";

type CalendarEvent = {
    id: string;
    eventName: string;
    startTimestamp: string;
    endTimestamp: string;
};

type RoomBooking = {
    id: string;
    purpose: string;
    room: string;
    "start time": Timestamp;
    "end time": Timestamp;
    bookedBy?: string;
    uid?: string;
};

const ROOMS = [
    "SAC Meeting Room",
    "SAC Multipurpose Room",
    "SAC Room 1",
    "SAC Room 2",
    "SAC Room 3",
];

export default function BookingScreen() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [roomName, setRoomName] = useState<string>(ROOMS[0]);
    const [eventName, setEventName] = useState<string>("");
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date(new Date().getTime() + 60 * 60 * 1000)); // Default 1 hour later

    const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
    const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<RoomBooking[]>([]);
    const [eventsLoading, setEventsLoading] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setEventsLoading(true);
            try {
                const [year, month, day] = selectedDate.split('-').map(Number);
                const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
                const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

                const roomsCol = collection(db, "rooms");
                const q = query(
                    roomsCol, 
                    where("start time", ">=", Timestamp.fromDate(startOfDay)),
                    where("start time", "<=", Timestamp.fromDate(endOfDay))
                );
                
                const snapshot = await getDocs(q);
                const list = snapshot.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                })) as RoomBooking[];
                
                list.sort((a, b) => a["start time"].toMillis() - b["start time"].toMillis());
                setEvents(list);
            } catch (err) {
                console.log("Error loading events:", err);
            } finally {
                setEventsLoading(false);
            }
        };

        if (user?.isAdmin) {
            fetchEvents();
        }
    }, [selectedDate, user?.isAdmin]);

    const formatHM = (date: Date): string => {
        let h: number | string = date.getHours();
        let m: number | string = date.getMinutes();
        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        return `${h}:${m}`;
    };

    const getTimestamps = () => {
        const [year, month, day] = selectedDate.split('-').map(Number);
        
        const startDateObj = new Date(year, month - 1, day, startTime.getHours(), startTime.getMinutes());
        let endDateObj = new Date(year, month - 1, day, endTime.getHours(), endTime.getMinutes());

        if (endDateObj <= startDateObj) {
            endDateObj.setDate(endDateObj.getDate() + 1);
        }

        return { startDateObj, endDateObj };
    };

    const checkForConflict = async (start: Date, end: Date, ignoreId?: string): Promise<boolean> => {
        try {
            const roomsCol = collection(db, "rooms");
            // Query only by room to avoid Firestore composite index errors which fail silently.
            const q = query(
                roomsCol, 
                where("room", "==", roomName)
            );
            
            const snapshot = await getDocs(q);

            const newStart = start.getTime();
            const newEnd = end.getTime();

            for (const d of snapshot.docs) {
                if (d.id === ignoreId) continue;
                
                const event = d.data() as Omit<RoomBooking, "id">;
                const existingStart = event["start time"].toMillis();
                const existingEnd = event["end time"].toMillis();

                // Overlap logic: (StartA < EndB) and (EndA > StartB)
                // This covers any existing event overlapping with the new booking time.
                if (newStart < existingEnd && newEnd > existingStart) {
                    return true;
                }
            }
            return false;
        } catch (err) {
            console.log("Error checking conflicts:", err);
            return false;
        }
    };

    const handleEdit = (ev: RoomBooking) => {
        setEditingId(ev.id);
        setEventName(ev.purpose);
        setRoomName(ev.room);
        const start = ev["start time"].toDate();
        const end = ev["end time"].toDate();
        
        const yyyy = start.getFullYear();
        const mm = String(start.getMonth() + 1).padStart(2, '0');
        const dd = String(start.getDate()).padStart(2, '0');
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
        
        setStartTime(start);
        setEndTime(end);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEventName("");
        setStartTime(new Date());
        setEndTime(new Date(new Date().getTime() + 60 * 60 * 1000));
        setRoomName(ROOMS[0]);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Delete Booking", "Are you sure you want to delete this booking?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "rooms", id));
                        setEvents(prev => prev.filter(e => e.id !== id));
                    } catch (err) {
                        console.log("Error deleting room:", err);
                        Alert.alert("Error", "Failed to delete booking.");
                    }
                }
            }
        ]);
    };

    const handleBook = async () => {
        if (!user?.isAdmin) {
            Alert.alert("Access Denied", "Only admins can book rooms.");
            return;
        }

        if (!eventName.trim()) {
            Alert.alert("Error", "Please enter an event name.");
            return;
        }

        setLoading(true);

        const { startDateObj, endDateObj } = getTimestamps();

        if (startDateObj < new Date()) {
            setLoading(false);
            Alert.alert("Error", "Cannot book a room in the past.");
            return;
        }

        // Double check sanity
        if (endDateObj <= startDateObj) {
            setLoading(false);
            Alert.alert("Error", "End time must be after start time.");
            return;
        }

        const hasConflict = await checkForConflict(startDateObj, endDateObj, editingId || undefined);

        if (hasConflict) {
            setLoading(false);
            Alert.alert("Conflict Detected", `The room "${roomName}" is already booked for this time slot.`);
            return;
        }

        try {
            if (editingId) {
                const docRef = doc(db, "rooms", editingId);
                const updatedData = {
                    "start time": Timestamp.fromDate(startDateObj),
                    "end time": Timestamp.fromDate(endDateObj),
                    purpose: eventName,
                    room: roomName,
                    bookedBy: user?.displayName || user?.email || "Unknown",
                    uid: user?.uid 
                };
                await updateDoc(docRef, updatedData);

                setEvents(prev => {
                    const filtered = prev.filter(e => e.id !== editingId);
                    const newEvents: RoomBooking[] = [...filtered, {
                        ...updatedData,
                        id: editingId,
                    }];
                    return newEvents.sort((a, b) => a["start time"].toMillis() - b["start time"].toMillis());
                });

                Alert.alert("Success", "Room booking updated!", [
                    {
                        text: "OK", onPress: () => {
                            handleCancelEdit();
                        }
                    }
                ]);
            } else {
                const roomsCol = collection(db, "rooms");
                const newData = {
                    "start time": Timestamp.fromDate(startDateObj),
                    "end time": Timestamp.fromDate(endDateObj),
                    purpose: eventName,
                    room: roomName,
                    bookedBy: user?.displayName || user?.email || "Unknown",
                    uid: user?.uid
                };
                const addedDoc = await addDoc(roomsCol, newData);

                setEvents(prev => {
                    const newEvents: RoomBooking[] = [...prev, {
                        ...newData,
                        id: addedDoc.id,
                    }];
                    return newEvents.sort((a, b) => a["start time"].toMillis() - b["start time"].toMillis());
                });

                Alert.alert("Success", "Room booked successfully!", [
                    {
                        text: "OK", onPress: () => {
                            setEventName("");
                        }
                    }
                ]);
            }
        } catch (err) {
            console.log("Error booking room:", err);
            Alert.alert("Error", editingId ? "Failed to update room." : "Failed to book room.");
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
                    <ThemedText style={styles.label}>Purpose:</ThemedText>
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
                        display="spinner"
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
                        display="spinner"
                        onChange={(e, d) => {
                            setShowEndPicker(false);
                            if (d) setEndTime(d);
                        }}
                    />
                )}

                <View style={[styles.row, { marginTop: verticalScale(20) }]}>
                    <TouchableOpacity
                        onPress={handleBook}
                        style={[styles.bookBtn, loading && styles.disabledBtn, { flex: 1, marginTop: 0 }]}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>{loading ? (editingId ? "Updating..." : "Checking...") : (editingId ? "Update Booking" : "Confirm Booking")}</Text>
                    </TouchableOpacity>
                    {editingId && (
                        <TouchableOpacity
                            onPress={handleCancelEdit}
                            style={[styles.cancelBtn, { flex: 1, marginTop: 0 }]}
                            disabled={loading}
                        >
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.dailyBookingsContainer}>
                    <ThemedText type="title" style={styles.header}>Bookings on {selectedDate}</ThemedText>
                    {eventsLoading ? (
                        <Text style={{ textAlign: "center", marginVertical: 10 }}>Loading...</Text>
                    ) : events.length === 0 ? (
                        <Text style={{ textAlign: "center", marginVertical: 10, color: "#666" }}>No bookings for this date.</Text>
                    ) : (
                        events.map((ev: RoomBooking) => {
                            const startTimeStr = ev["start time"].toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const endTimeStr = ev["end time"].toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const isOwner = user?.uid && ev.uid === user.uid;
                            return (
                                <View key={ev.id} style={styles.eventBlock}>
                                    <View style={styles.eventInfo}>
                                        <Text style={styles.eventName}>{ev.room} - {ev.purpose}</Text>
                                        <Text style={styles.eventTime}>{startTimeStr} - {endTimeStr}</Text>
                                        <Text style={styles.eventBooker}>Booked by: {ev.bookedBy || "Unknown"}</Text>
                                    </View>
                                    {isOwner && (
                                        <View style={styles.eventActions}>
                                            <TouchableOpacity onPress={() => handleEdit(ev)} style={styles.editBtn}>
                                                <Text style={styles.actionText}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(ev.id)} style={styles.deleteBtn}>
                                                <Text style={styles.actionText}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    contentContainer: { padding: moderateScale(20), paddingBottom: verticalScale(50) },
    header: { textAlign: 'center', marginBottom: verticalScale(20) },
    calendar: { borderRadius: moderateScale(10), borderWidth: 1, borderColor: '#eee', marginBottom: verticalScale(15) },
    field: { marginBottom: verticalScale(15) },
    row: { flexDirection: 'row', gap: scale(10) },
    label: { marginBottom: verticalScale(8), fontWeight: '600' },
    textInput: {
        borderWidth: 1, borderColor: "#ccc", borderRadius: moderateScale(8), padding: moderateScale(12), fontSize: moderateScale(16), color: '#000'
    },
    timeBox: {
        borderWidth: 1, borderColor: "#ccc", borderRadius: moderateScale(8),
        padding: moderateScale(12), alignItems: "center"
    },
    bookBtn: {
        backgroundColor: "#0a7ea4", padding: moderateScale(16), borderRadius: moderateScale(10), alignItems: "center", marginTop: verticalScale(20)
    },
    disabledBtn: {
        backgroundColor: "#a0c4d1"
    },
    btnText: { color: "white", fontWeight: "bold", fontSize: moderateScale(18) },
    roomList: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(8) },
    roomChip: { paddingHorizontal: scale(12), paddingVertical: verticalScale(8), borderRadius: moderateScale(20), backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
    roomChipSelected: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
    roomChipText: { color: '#333' },
    roomChipTextSelected: { color: '#fff', fontWeight: 'bold' },
    cancelBtn: { backgroundColor: "#f44336", padding: moderateScale(16), borderRadius: moderateScale(10), alignItems: "center" },
    dailyBookingsContainer: { marginTop: verticalScale(40), borderTopWidth: 1, borderTopColor: '#eee', paddingTop: verticalScale(20) },
    eventBlock: { backgroundColor: "#add8e6", marginVertical: verticalScale(5), padding: moderateScale(10), borderRadius: moderateScale(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    eventInfo: { flex: 1 },
    eventActions: { flexDirection: 'row', gap: scale(10), marginLeft: scale(10) },
    editBtn: { backgroundColor: '#4caf50', padding: moderateScale(6), borderRadius: moderateScale(4) },
    deleteBtn: { backgroundColor: '#f44336', padding: moderateScale(6), borderRadius: moderateScale(4) },
    actionText: { color: 'white', fontSize: moderateScale(12), fontWeight: 'bold' },
    eventName: { fontWeight: "bold" },
    eventTime: { color: "#333", marginTop: verticalScale(2) },
    eventBooker: { color: "#555", marginTop: verticalScale(4), fontStyle: 'italic', fontSize: moderateScale(12) }
});
