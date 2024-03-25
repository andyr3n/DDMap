import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

const MarkerTypeSelection = ({ onMarkerTypeSelected, onClose, onSave }) => {

    const [selectedType, setSelectedType] = useState(null);


    const handleSaveMarker = () => {
        if (selectedType) {
          onMarkerTypeSelected(selectedType); // Set the type of the temporary marker
          onSave(); // Save the marker
          setSelectedType(null); // Reset selection
        }
      };
      

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, selectedType === 'Building Number' && styles.selectedOption]}
          onPress={() => setSelectedType('Building Number')}
        >
          <MaterialIcons name="apartment" size={24} color="black" />
          <Text style={styles.optionText}>Building Number</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, selectedType === 'Note' && styles.selectedOption]}
          onPress={() => setSelectedType('Note')}
        >
          <Ionicons name="document-text" size={24} color="black" />
          <Text style={styles.optionText}>Note</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, selectedType === 'Entrance/Exit' && styles.selectedOption]}
          onPress={() => setSelectedType('Entrance/Exit')}
        >
          <FontAwesome5 name="door-open" size={24} color="black" />
          <Text style={styles.optionText}>Entrance/Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, selectedType === 'Public Washroom' && styles.selectedOption]}
          onPress={() => setSelectedType('Public Washroom')}
        >
          <FontAwesome5 name="toilet" size={24} color="black" />
          <Text style={styles.optionText}>Public Washroom</Text>
        </TouchableOpacity>
        {/* Add more options here */}
      </View>
      <Button title="Save Marker" onPress={handleSaveMarker} disabled={!selectedType} />
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
  closeButton: {
    alignSelf: 'flex-end',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#f0f0f0',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20, // Add some space above the Save Marker button
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'lightblue', // Highlight the selected option
  },
  optionText: {
    marginTop: 5,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
  },  
});

export default MarkerTypeSelection;

