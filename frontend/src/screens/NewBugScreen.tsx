// /screens/NewBugScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createBug } from '../services/api';
import { useBugContext } from '../contexts/BugContext';

export default function NewBugScreen() {
  const [bugName, setBugName] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const { setBugs } = useBugContext();

  const handleCreateBug = async () => {
    const newBug = { name: bugName, description: bugDescription };
    try {
      const createdBug = await createBug(newBug);
      setBugs((prevBugs) => [...prevBugs, createdBug]);
      setBugName('');
      setBugDescription('');
    } catch (error) {
      console.error('Error creating bug:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Bug</Text>
      <TextInput
        style={styles.input}
        placeholder="Bug Name"
        value={bugName}
        onChangeText={setBugName}
      />
      <TextInput
        style={styles.input}
        placeholder="Bug Description"
        value={bugDescription}
        onChangeText={setBugDescription}
      />
      <Button title="Create Bug" onPress={handleCreateBug} />
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});
