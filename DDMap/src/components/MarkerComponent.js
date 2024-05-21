import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, TouchableOpacity, TextInput, Button, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import buildingIcon from '../../assets/markers/Building_marker.png';
import noteIcon from '../../assets/markers/notes_marker.png';
import entranceExitIcon from '../../assets/markers/entrance_marker.png';
import publicWashroomIcon from '../../assets/markers/washroom_marker.png';

const MarkerComponent = ({
  marker,
  thumbUpMarker,
  thumbDownMarker,
  deleteMarker,
  setTempMarker,
  saveTempMarker
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'Building Number':
        return buildingIcon;
      case 'Note':
        return noteIcon;
      case 'Entrance/Exit':
        return entranceExitIcon;
      case 'Public Washroom':
        return publicWashroomIcon;
      default:
        return null; // default icon if needed
    }
  };

  return (
    <Marker
      coordinate={marker.coordinate}
      title={marker.type}
      description={marker.description}
      draggable={marker.id === (marker.tempMarker ? marker.tempMarker.id : null)}
      onDragEnd={(e) => setTempMarker({ ...marker, coordinate: e.nativeEvent.coordinate })}
    >
      <Image source={getIcon(marker.type)} style={styles.iconStyle} />
      <Callout>
        <View style={styles.calloutContainer}>
          <Text>{marker.type}</Text>
          <Text>Description: {marker.description}</Text>
          <Text>Created by: {marker.username}</Text>
          <View style={styles.thumbContainer}>
            <TouchableOpacity onPress={() => thumbUpMarker(marker.id)} style={styles.thumbsButton}>
              <FontAwesome name="thumbs-up" size={24} color={marker.thumbsUp === 1 ? 'green' : 'black'} />
            </TouchableOpacity>
            <Text>{marker.thumbsUp}</Text>
            <TouchableOpacity onPress={() => thumbDownMarker(marker.id)} style={styles.thumbsButton}>
              <FontAwesome name="thumbs-down" size={24} color={marker.thumbsDown === 1 ? 'red' : 'black'} />
            </TouchableOpacity>
            <Text>{marker.thumbsDown}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteMarker(marker.id)} style={styles.deleteButton}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
          {marker.tempMarker && (
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              value={marker.description}
              onChangeText={(text) => setTempMarker({ ...marker, description: text })}
            />
          )}
          {marker.tempMarker && (
            <Button title="Save Marker" onPress={saveTempMarker} />
          )}
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 30,
    height: 30,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  thumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  thumbsButton: {
    marginHorizontal: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    height: 40,
    textAlign: 'center',
  }
});

export default MarkerComponent;

