// src/components/MarkerDescriptionInput.js
import React from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';

const MarkerDescriptionInput = ({ onSaveDescription, onClose }) => {
  const [description, setDescription] = React.useState('');

  const handleSaveDescription = () => {
    onSaveDescription(description);
    setDescription(''); // Reset the input
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter description..."
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Save Description" onPress={handleSaveDescription} />
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});

export default MarkerDescriptionInput;
