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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile pic:</Text>
            <TextInput
              value={newProfilePicture}
              onChangeText={setNewProfilePicture}
              style={styles.input}
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Save Changes" onPress={handleUpdateProfile} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Cancel" onPress={() => setEditing(false)} color="red" />
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.username}>{user.displayName || 'John Doe'}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Edit Profile" onPress={() => setEditing(true)} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Logout" onPress={handleLogout} color="red" />
            </View>
          </View>
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
    padding: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: '#fff',
    maxWidth: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default Profile;










