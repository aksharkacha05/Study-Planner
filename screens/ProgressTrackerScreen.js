// src/screens/ProgressTrackerScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Checkbox, Text, Title, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressTrackerScreen = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const storedPlans = await AsyncStorage.getItem('studyPlans');
      if (storedPlans) setStudyPlans(JSON.parse(storedPlans));

      const storedCompleted = await AsyncStorage.getItem('completedTopics');
      if (storedCompleted) setCompletedTopics(JSON.parse(storedCompleted));
    };
    fetchPlans();
  }, []);

  const toggleCompletion = async (topic) => {
    let updatedCompleted = [...completedTopics];
    if (completedTopics.includes(topic)) {
      updatedCompleted = completedTopics.filter(item => item !== topic);
    } else {
      updatedCompleted.push(topic);
    }
    setCompletedTopics(updatedCompleted);
    await AsyncStorage.setItem('completedTopics', JSON.stringify(updatedCompleted));
  };

  const calculateProgress = (topics) => {
    const completedCount = topics.filter(topic => completedTopics.includes(topic)).length;
    return topics.length > 0 ? completedCount / topics.length : 0;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={studyPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.subject}</Title>
              <ProgressBar progress={calculateProgress(item.topics)} color="#6200ee" />
              {item.topics.map((topic, index) => (
                <View key={index} style={styles.topicItem}>
                  <Checkbox
                    status={completedTopics.includes(topic) ? 'checked' : 'unchecked'}
                    onPress={() => toggleCompletion(topic)}
                  />
                  <Text>{topic}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
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
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
});

export default ProgressTrackerScreen;
