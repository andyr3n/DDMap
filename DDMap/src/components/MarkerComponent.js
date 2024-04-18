import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const MarkerComponent = ({
  marker,
  thumbUpMarker,
  thumbDownMarker,
  deleteMarker,
  setTempMarker,
  saveTempMarker
}) => {
  return (
    <Marker
      key={marker.id}
      coordinate={marker.coordinate}
      title={marker.type}
      draggable={marker.id === (marker.tempMarker ? marker.tempMarker.id : null)}
      onDragEnd={(e) => setTempMarker({ ...marker, coordinate: e.nativeEvent.coordinate })}
    >
      <Callout>
        <View style={styles.calloutContainer}>
          <Text>Type: {marker.type}</Text>
          <Text>Description: {marker.description}</Text>
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

const styles = {
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
    marginHorizontal: 10, // Increase horizontal margin
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
};

export default MarkerComponent;
