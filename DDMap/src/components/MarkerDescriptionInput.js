import React from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';

const MarkerDescriptionInput = ({ onSaveDescription, onClose }) => {
  const [description, setDescription] = React.useState('');

  const handleSaveDescription = () => {
    onSaveDescription(description);
    setDescription(''); // Reset the input
  };

  const handleClose = () => {
    onClose();
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
      <View style={styles.buttonContainer}>
        <Button title="Save Marker" onPress={handleSaveDescription} />
        <Button title="Close" onPress={handleClose} />
      </View>
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
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  }
});

export default MarkerDescriptionInput;

