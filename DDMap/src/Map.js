import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Alert, View, TouchableOpacity, Text } from 'react-native';
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
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [markerDescription, setMarkerDescription] = useState("");
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);


  const saveDescription = (description) => {
    setMarkerDescription(description);
    setShowDescriptionInput(false);
  };


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'This app needs location permissions to function correctly.',
          [{ text: 'OK' }]
        );
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

  const addTempMarker = (type) => {
    setShowMarkerTypeSelection(false);
    setTempMarker({
      id: Math.random().toString(),
      coordinate: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      type: type,
    });
  };
  

  const saveMarker = () => {
    if (tempMarker) {
      setMarkers((currentMarkers) => [...currentMarkers, tempMarker]);
      setTempMarker(null); // Clear the temporary marker
      setShowMarkerTypeSelection(false);
      setShowDescriptionInput(true); // Show the description input
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

  const addMarker = (type) => {
    console.log(`Adding a marker of type: ${type}`);
    setShowMarkerTypeSelection(false);
    setMarkers((currentMarkers) => [
      ...currentMarkers,
      {
        id: Math.random().toString(), // Assign a unique id for the key prop
        coordinate: region, // Use the current region as the marker's location
        type: type,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onMapReady={() => setRegion(region)}
        showsUserLocation={true}
        onPress={(e) => {
          if (!tempMarker) {
            setTempMarker({
              id: Math.random().toString(),
              coordinate: e.nativeEvent.coordinate,
              type: 'Building Number', // Default type, can be changed later in MarkerTypeSelection
            });
          }
        }}        
      >
        {tempMarker && (
          <Marker
            draggable
            coordinate={tempMarker.coordinate}
            onDragEnd={(e) => setTempMarker({ ...tempMarker, coordinate: e.nativeEvent.coordinate })}
          >
            <Callout>
              <Text>{tempMarker.type}</Text>
            </Callout>
          </Marker>
        )}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.type}
          >
            <Callout>
              <Text>{marker.type}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setShowMarkerTypeSelection(true)}>
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
          onSave={saveMarker}
        />
      )}
      {showDescriptionInput && (
        <MarkerDescriptionInput
          onSaveDescription={saveDescription}
          onClose={() => setShowDescriptionInput(false)}
        />
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
  markerTypeSelection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height / 5,
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 40, // Add padding at the top for the close button
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },  
  markerTypeButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  
});

export default Map;
