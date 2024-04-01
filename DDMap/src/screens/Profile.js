import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button } from 'react-native';
import { getAuth, updateProfile, signOut } from '@firebase/auth';

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user.displayName || '');
  const [newProfilePicture, setNewProfilePicture] = useState(user.photoURL || '');

  const handleUpdateProfile = () => {
    updateProfile(user, {
      displayName: newUsername,
      photoURL: newProfilePicture,
    }).then(() => {
      setEditing(false);
      console.log('Profile updated successfully');
    }).catch((error) => {
      console.error('Error updating profile:', error);
    });
  };

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
        source={{ uri: user.photoURL || 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />
      {editing ? (
        <>
          <TextInput
            value={newUsername}
            onChangeText={setNewUsername}
            style={styles.input}
          />
          <TextInput
            value={newProfilePicture}
            onChangeText={setNewProfilePicture}
            style={styles.input}
          />
          <Button title="Save Changes" onPress={handleUpdateProfile} />
        </>
      ) : (
        <>
          <Text style={styles.username}>{user.displayName || 'John Doe'}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Button title="Edit Profile" onPress={() => setEditing(true)} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
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
    borderRadius: 75,
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
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default Profile;






