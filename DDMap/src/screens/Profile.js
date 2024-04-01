import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { getAuth, signOut } from '@firebase/auth';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
        // Navigate to the login screen or reset the navigation stack
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }} // Use user's photo URL if available
        style={styles.profileImage}
      />
      <Text style={styles.username}>{user?.displayName || 'John Doe'}</Text>
      <Text style={styles.info}>Email: {user?.email || 'johndoe@example.com'}</Text>
      {/* Add more profile details here */}
      <Button title="Logout" onPress={handleLogout} />
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



