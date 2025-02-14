// src/screens/NotesScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Card, Title, Paragraph, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotesScreen = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    };
    fetchNotes();
  }, []);

  const saveNote = async () => {
    if (note.trim() === '') return;
    const newNote = { id: Date.now().toString(), text: note };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNote('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Note</Title>
              <Paragraph>{item.text}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
      <TextInput
        label="New Note"
        value={note}
        onChangeText={setNote}
        mode="outlined"
        style={styles.input}
      />
      <FAB
        style={styles.fab}
        icon="check"
        label="Save Note"
        onPress={saveNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
  },
  input: {
    marginVertical: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default NotesScreen;
