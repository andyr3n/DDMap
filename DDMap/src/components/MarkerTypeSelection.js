import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MaterialIcons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

const MarkerTypeSelection = ({ onMarkerTypeSelected, onClose }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => onMarkerTypeSelected('Building Number')}>
            <MaterialIcons name="apartment" size={24} color="black" />
          <Text style={styles.buttonText}>Building Number</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onMarkerTypeSelected('Note')}>
          <Ionicons name="document-text" size={24} color="black" />
          <Text style={styles.buttonText}>Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onMarkerTypeSelected('Entrance/Exit')}>
          <FontAwesome6 name="door-open" size={24} color="black" />
          <Text style={styles.buttonText}>Entrance/Exit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onMarkerTypeSelected('Public Washroom')}>
          <FontAwesome5 name="toilet" size={24} color="black" />
          <Text style={styles.buttonText}>Public Washroom</Text>
        </TouchableOpacity>
        {/* Add more buttons here */}
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
});

export default MarkerTypeSelection;

