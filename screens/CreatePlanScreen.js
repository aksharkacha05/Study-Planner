// src/screens/CreatePlanScreen.js
import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Title, FAB, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePlanScreen = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (newTopic.trim() === '') return;
    setTopics([...topics, newTopic]);
    setNewTopic('');
  };

  const savePlan = async () => {
    if (subject.trim() === '' || topics.length === 0) return;
    const newPlan = { id: Date.now().toString(), subject, topics };
    const storedPlans = await AsyncStorage.getItem('studyPlans');
    const plans = storedPlans ? JSON.parse(storedPlans) : [];
    plans.push(newPlan);
    await AsyncStorage.setItem('studyPlans', JSON.stringify(plans));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Subject Name"
        value={subject}
        onChangeText={setSubject}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="New Topic"
        value={newTopic}
        onChangeText={setNewTopic}
        mode="outlined"
        style={styles.input}
        right={<TextInput.Icon icon="plus" onPress={addTopic} />}
      />
      <FlatList
        data={topics}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item}</Title>
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        style={styles.fab}
        icon="check"
        label="Save Plan"
        onPress={savePlan}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  input: {
    marginVertical: 10,
  },
  card: {
    marginVertical: 5,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CreatePlanScreen;
