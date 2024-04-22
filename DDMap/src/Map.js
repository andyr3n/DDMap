import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Alert, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import MarkerTypeSelection from './components/MarkerTypeSelection';
import MarkerDescriptionInput from './components/MarkerDescriptionInput';
import MarkerComponent from './components/MarkerComponent';

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
  const [mapType, setMapType] = useState('standard'); // 'standard' or 'satellite'
  const [mapTypeText, setMapTypeText] = useState('Satellite View');
  const mapRef = useRef(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

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

  useEffect(() => {
    setMapTypeText(mapType === 'standard' ? 'Satellite View' : 'Default View');
  }, [mapType]);

  const handleAddMarker = () => {
    setShowMarkerTypeSelection(true);
  };

  const addTempMarker = (type) => {
    const center = mapRef.current.__lastRegion || region;
    setTempMarker({
      id: Math.random().toString(),
      coordinate: {
        latitude: center.latitude,
        longitude: center.longitude,
      },
      type: type,
      description: '',
      thumbsUp: 0,
      thumbsDown: 0,
    });
    setShowDescriptionInput(true);
    setShowMarkerTypeSelection(false);
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

  const thumbUpMarker = (markerId) => {
    setMarkers((currentMarkers) => currentMarkers.map(marker => {
      if (marker.id === markerId) {
        return { ...marker, thumbsUp: marker.thumbsUp === 1 ? 0 : 1, thumbsDown: 0 };
      }
      return marker;
    }));
  };

  const thumbDownMarker = (markerId) => {
    setMarkers((currentMarkers) => currentMarkers.map(marker => {
      if (marker.id === markerId) {
        return { ...marker, thumbsUp: 0, thumbsDown: marker.thumbsDown === 1 ? 0 : 1 };
      }
      return marker;
    }));
  };

  const deleteMarker = (markerId) => {
    Alert.alert(
      'Delete Marker',
      'Are you sure you want to delete this marker?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            setMarkers((currentMarkers) => currentMarkers.filter(marker => marker.id !== markerId));
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
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

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onMapReady={() => setRegion(region)}
        showsUserLocation={true}
        mapType={mapType === 'standard' ? 'standard' : 'satellite'}
      >
        {tempMarker && (
          <Marker
            key={tempMarker.id}
            coordinate={tempMarker.coordinate}
            draggable
            onDragEnd={(e) => setTempMarker({ ...tempMarker, coordinate: e.nativeEvent.coordinate })}
          >
          </Marker>
        )}
        {markers.map((marker) => (
          <MarkerComponent
            key={marker.id}
            marker={marker}
            thumbUpMarker={thumbUpMarker}
            thumbDownMarker={thumbDownMarker}
            deleteMarker={deleteMarker}
            setTempMarker={setTempMarker}
            saveTempMarker={saveTempMarker}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddMarker}>
          <FontAwesome name="plus" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.buttonText}>Add Marker</Text>
        <TouchableOpacity style={styles.button} onPress={toggleMapType}>
          <FontAwesome5 name={mapType === 'standard' ? 'satellite-dish' : 'map'} size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.buttonText}>{mapTypeText}</Text>
        <TouchableOpacity style={styles.button} onPress={goToMyLocation}>
          <FontAwesome name="location-arrow" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.buttonText}>My Position</Text>
      </View>
      {showMarkerTypeSelection && (
        <MarkerTypeSelection
          onMarkerTypeSelected={addTempMarker}
          onClose={() => setShowMarkerTypeSelection(false)}
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
    width: 79,
  },
  button: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 30,
    marginBottom: 5,
    width: 40, // Set width to make it circular
    height: 40, // Set height to make it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 12.5,
  },
});

export default Map;

