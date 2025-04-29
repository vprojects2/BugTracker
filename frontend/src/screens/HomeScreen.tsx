// /screens/HomeScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useBugContext } from '../contexts/BugContext';
import { getBugs } from '../services/api';

export default function HomeScreen() {
  const { bugs, setBugs } = useBugContext();

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const fetchedBugs = await getBugs();
        setBugs(fetchedBugs);
      } catch (error) {
        console.error('Error fetching bugs:', error);
      }
    };
    fetchBugs();
  }, [setBugs]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bug Tracker</Text>
      <FlatList
        data={bugs}
        renderItem={({ item }) => (
          <View style={styles.bugCard}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Create New Bug" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  bugCard: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
});
