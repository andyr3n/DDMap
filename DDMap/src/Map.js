import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, Alert, View, TouchableOpacity, Text, Image, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { getAuth } from '@firebase/auth';
import MarkerTypeSelection from './components/MarkerTypeSelection';
import MarkerDescriptionInput from './components/MarkerDescriptionInput';
import MarkerComponent from './components/MarkerComponent';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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
  const [mapType, setMapType] = useState('standard'); // 'standard' or 'satellite'
  const [mapTypeText, setMapTypeText] = useState('Satellite View');
  const mapRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;

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
    const center = mapRef.current.__lastRegion || region;
    setTempMarker({
      id: Math.random().toString(),
      coordinate: center,
      type: '', // Placeholder for type
      description: '',
      username: user ? user.displayName : 'Unknown User', // username
      thumbsUp: 0,
      thumbsDown: 0
    });
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
      type: type,  // Ensure this sets the type
      description: '',
      username: user ? user.displayName : 'Unknown User', // Add username here
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

  const getMarkerImage = (type) => {
    switch (type) {
      case 'Building Number':
        return require('../assets/markers/Building_marker.png');
      case 'Note':
        return require('../assets/markers/notes_marker.png');
      case 'Entrance/Exit':
        return require('../assets/markers/entrance_marker.png');
      case 'Public Washroom':
        return require('../assets/markers/washroom_marker.png');
      default:
        return require('../assets/markers/Building_marker.png'); // A default marker image if the type is not recognized
    }
  };

  const thumbUpMarker = (markerId) => {
    setMarkers((currentMarkers) => currentMarkers.map(marker => {
      if (marker.id === markerId) {
        return { ...marker, thumbsUp: marker.thumbsUp === 1 ? 0 : marker.thumbsUp + 1, thumbsDown: 0 };
      }
      return marker;
    }));
  };

  const thumbDownMarker = (markerId) => {
    setMarkers((currentMarkers) => currentMarkers.map(marker => {
      if (marker.id === markerId) {
        return { ...marker, thumbsUp: 0, thumbsDown: marker.thumbsDown === 1 ? 0 : marker.thumbsDown + 1 };
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
    mapRef.current.animateToRegion(newRegion, 500);
  };

  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const handleSearchResult = (data, details) => {
    console.log('Search Result:', data, details); // Debugging log
    if (details) {
      const { lat, lng } = details.geometry.location;
      const newRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 500);
      const newMarker = {
        id: Math.random().toString(),
        coordinate: {
          latitude: lat,
          longitude: lng,
        },
        type: 'Searched Location',  // You can customize this as needed
        description: data.description,
        username: user ? user.displayName : 'Unknown User', // Add username here
        thumbsUp: 0,
        thumbsDown: 0,
      };
      setMarkers((currentMarkers) => [
        ...currentMarkers,
        newMarker
      ]);
    } else {
      console.error('Error: Details are undefined');
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null) => handleSearchResult(data, details)}
        query={{
          key: process.env.GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          container: {
            position: 'absolute',
            width: '90%',
            zIndex: 1,
            top: 15,
            alignSelf: 'center',
          },
          textInputContainer: {
            width: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ccc',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          },
          textInput: {
            height: 50,
            color: '#5d5d5d',
            fontSize: 18,
            paddingHorizontal: 10,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
          listView: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ccc',
            marginTop: 5,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
          }
        }}
        onFail={error => console.error('GooglePlacesAutocomplete Error: ', error)}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          if (tempMarker) {
            setTempMarker(currentMarker => ({
              ...currentMarker,
              coordinate: {
                latitude: newRegion.latitude,
                longitude: newRegion.longitude
              }
            }));
          }
        }}
        showsUserLocation={true}
        mapType={mapType === 'standard' ? 'standard' : 'satellite'}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null} // Use Google Maps on Android and default (Apple Maps) on iOS
      >
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
      {tempMarker && tempMarker.type && (
        <View style={styles.staticMarkerContainer}>
          <Image
            style={styles.staticMarker}
            source={getMarkerImage(tempMarker.type)}
          />
        </View>
      )}
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
        {tempMarker && (
          <TouchableOpacity style={styles.button} onPress={saveTempMarker}>
            <Text style={styles.buttonText}>Confirm Marker</Text>
          </TouchableOpacity>
        )}
      </View>
      {showMarkerTypeSelection && (
        <MarkerTypeSelection
          onMarkerTypeSelected={addTempMarker}
          onClose={() => {
            setShowMarkerTypeSelection(false);
            setTempMarker(null); // Cancel temp marker placement
          }}
        />
      )}
      {showDescriptionInput && (
        <MarkerDescriptionInput
          onSaveDescription={saveDescription}
          onClose={() => {
            setShowDescriptionInput(false);
            setTempMarker(null); // Reset temp marker when closing description input
          }}
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
    width: 40,
    height: 40, // Circular: width = height
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 12.5,
  },
  staticMarkerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -29, // Adjust this value to move the marker higher
    marginLeft: -15, // Half of the marker's width
  },
  staticMarker: {
    width: 30,
    height: 30,
  },
});

export default Map;
