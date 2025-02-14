// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button, Title, Paragraph, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [studyPlans, setStudyPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const storedPlans = await AsyncStorage.getItem('studyPlans');
      if (storedPlans) setStudyPlans(JSON.parse(storedPlans));
    };
    const unsubscribe = navigation.addListener('focus', fetchPlans);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={studyPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.subject}</Title>
              <Paragraph>Topics:</Paragraph>
              {item.topics.map((topic, index) => (
                <Text key={index}>• {topic}</Text>
              ))}
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="New Plan"
        onPress={() => navigation.navigate('CreatePlan')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f4f4f9',
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
