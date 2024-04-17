import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Alert, View, TouchableOpacity, Text, TextInput, Button } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MarkerTypeSelection from './components/MarkerTypeSelection';
import MarkerDescriptionInput from './components/MarkerDescriptionInput';

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 49.2827,
    longitude: 123.1207,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showMarkerTypeSelection, setShowMarkerTypeSelection] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [tempMarker, setTempMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission Required', 'This app needs location permissions to function correctly.', [{ text: 'OK' }]);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleAddMarker = () => {
    const center = mapRef.current.__lastRegion || region;
    setTempMarker({
      id: Math.random().toString(),
      coordinate: {
        latitude: center.latitude,
        longitude: center.longitude,
      },
      type: 'Building Number', // Default type, can be changed later
      description: '',
      comments: []
    });
    setShowDescriptionInput(true);
  };

  const saveDescription = (description) => {
    if (tempMarker) {
      setMarkers((currentMarkers) => [
        ...currentMarkers,
        { ...tempMarker, description: description }
      ]);
      setTempMarker(null);
    }
    setShowDescriptionInput(false);
  };

  const saveTempMarker = () => {
    if (tempMarker) {
      setMarkers((currentMarkers) => [
        ...currentMarkers,
        { ...tempMarker }
      ]);
      setTempMarker(null);
      setShowDescriptionInput(false); // Close the description input after saving
    }
  };

  const startCommenting = (markerId) => {
    setSelectedMarkerId(markerId);
  };

  const addCommentToMarker = (comment) => {
    setMarkers((currentMarkers) => currentMarkers.map(marker => {
      if (marker.id === selectedMarkerId) {
        return { ...marker, comments: [...marker.comments, comment] };
      }
      return marker;
    }));
    setCommentText('');
    setSelectedMarkerId(null);
  };

  const submitComment = () => {
    if (commentText) {
      addCommentToMarker(commentText);
    }
  };

  const goToMyLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    mapRef.current.animateToRegion(newRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onMapReady={() => setRegion(region)}
        showsUserLocation={true}
      >
        {tempMarker && (
          <Marker
            key={tempMarker.id}
            coordinate={tempMarker.coordinate}
            draggable
            onDragEnd={(e) => setTempMarker({ ...tempMarker, coordinate: e.nativeEvent.coordinate })}
          >
            <Callout>
              <Text>{tempMarker.type}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter description"
                value={tempMarker.description}
                onChangeText={(text) => setTempMarker({ ...tempMarker, description: text })}
              />
              <Button title="Save Marker" onPress={saveTempMarker} />
            </Callout>
          </Marker>
        )}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.type}
          >
            <Callout onPress={() => startCommenting(marker.id)}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Type: {marker.type}</Text>
                <Text>Description: {marker.description}</Text>
                {marker.comments.map((comment, index) => (
                  <Text key={index}>Comment: {comment}</Text>
                ))}
                <Button title="Add Comment" onPress={() => startCommenting(marker.id)} />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddMarker}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.buttonText}>Add Marker</Text>
        <TouchableOpacity style={styles.button} onPress={goToMyLocation}>
          <Ionicons name="locate" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.buttonText}>My Position</Text>
      </View>
      {showMarkerTypeSelection && (
        <MarkerTypeSelection
          onMarkerTypeSelected={addTempMarker}
          onClose={() => setShowMarkerTypeSelection(false)}
          onSave={saveDescription}
        />
      )}
      {showDescriptionInput && (
        <MarkerDescriptionInput
          onSaveDescription={saveDescription}
          onClose={() => setShowDescriptionInput(false)}
        />
      )}
      {selectedMarkerId && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter comment"
            value={commentText}
            onChangeText={setCommentText}
          />
          <Button title="Submit Comment" onPress={submitComment} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 5,
    left: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 30,
    marginBottom: 5,
  },
  buttonText: {
    color: 'black',
    marginBottom: 5,
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    height: 40,
    textAlign: 'center',
  },
});

export default Map;
