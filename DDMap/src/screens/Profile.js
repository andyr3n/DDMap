// src/Profile.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Profile = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image, replace with actual image URL
        style={styles.profileImage}
      />
      <Text style={styles.username}>John Doe</Text>
      <Text style={styles.info}>Email: johndoe@example.com</Text>
      <Text style={styles.info}>Location: New York, USA</Text>
      {/* Add more profile details here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make the image round
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Add more styles for your profile screen here
});

export default Profile;


