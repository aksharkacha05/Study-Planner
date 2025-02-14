// src/screens/TimetableScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, TextInput, Button, Title, Paragraph, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestPermissions, scheduleNotification } from '../util/notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimetableScreen = () => {
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      const storedTimetable = await AsyncStorage.getItem('timetable');
      if (storedTimetable) setTimetable(JSON.parse(storedTimetable));
    };
    fetchTimetable();
    requestPermissions(); // Request notification permissions on load
  }, []);

  const addSession = async () => {
    if (subject.trim() === '') {
      Alert.alert('Error', 'Please enter the subject!');
      return;
    }
    const newSession = { id: Date.now().toString(), subject, time: time.toLocaleTimeString() };
    const updatedTimetable = [...timetable, newSession];
    setTimetable(updatedTimetable);
    await AsyncStorage.setItem('timetable', JSON.stringify(updatedTimetable));
    setSubject('');
    setTime(new Date());

    // Schedule Notification
    await scheduleNotification(
      'Study Reminder',
      `Time to study ${subject}!`,
      time
    );
    Alert.alert('Success', 'Study session added and reminder set!');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={timetable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.subject}</Title>
              <Paragraph>Time: {item.time}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
      <TextInput
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="outlined"
        onPress={() => setShowTimePicker(true)}
        style={styles.timeButton}
      >
        Select Time
      </Button>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) setTime(selectedDate);
          }}
        />
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Session"
        onPress={addSession}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
  },
  input: {
    marginVertical: 10,
  },
  timeButton: {
    marginVertical: 10,
  },
  fab: {
    position: 'static',
    margin: 18,
    right: 0,
    bottom: 20,
  },
});

export default TimetableScreen;
