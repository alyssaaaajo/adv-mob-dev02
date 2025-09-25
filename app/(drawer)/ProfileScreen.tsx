import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';

const STORAGE_KEY_NAME = '@profile_name';
const STORAGE_KEY_EMAIL = '@profile_email';
const STORAGE_KEY_PROFILE_PIC = '@profile_pic_uri';

export default function ProfileScreen() {
  const [name, setName] = useState('Akaza');
  const [email, setEmail] = useState('relapseGodz@email.com');
  const [profilePicUri, setProfilePicUri] = useState(
    Image.resolveAssetSource(require('@/assets/images/profile.jpg')).uri
  );
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { theme } = useTheme();

  const shake = useSharedValue(0);

  // Load saved data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const savedName = await AsyncStorage.getItem(STORAGE_KEY_NAME);
        const savedEmail = await AsyncStorage.getItem(STORAGE_KEY_EMAIL);
        const savedPicUri = await AsyncStorage.getItem(STORAGE_KEY_PROFILE_PIC);

        if (savedName !== null) setName(savedName);
        if (savedEmail !== null) setEmail(savedEmail);
        if (savedPicUri !== null) setProfilePicUri(savedPicUri);
      } catch (e) {
        console.log('Failed to load profile data:', e);
      }
    }

    loadProfile();
  }, []);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Save data to AsyncStorage
  const saveProfile = async (newName: string, newEmail: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_NAME, newName);
      await AsyncStorage.setItem(STORAGE_KEY_EMAIL, newEmail);
    } catch (e) {
      console.log('Failed to save profile data:', e);
    }
  };

  // Save profile pic uri
  const saveProfilePicUri = async (uri: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_PROFILE_PIC, uri);
    } catch (e) {
      console.log('Failed to save profile pic:', e);
    }
  };

  const handleSave = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      return;
    }
    setEmailError('');
    setIsEditing(false);
    saveProfile(name, email); // Save name/email
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  // Open image library to pick profile pic
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          // User cancelled
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'ImagePicker Error');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const pickedUri = response.assets[0].uri;
          if (pickedUri) {
            setProfilePicUri(pickedUri);
            saveProfilePicUri(pickedUri);
          }
        }
      }
    );
  };

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profilePicUri }} style={styles.profilePic} />
      </TouchableOpacity>
      <Text style={{ color: theme === 'dark' ? '#888' : '#555', marginBottom: 10 }}>

      </Text>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Username"
            placeholderTextColor={theme === 'dark' ? '#aaa' : '#555'}
          />
          <Animated.View style={[animatedShakeStyle, { width: '100%' }]}>
            <TextInput
              style={[styles.input, emailError ? styles.errorInput : null]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              placeholder="Email"
              placeholderTextColor={theme === 'dark' ? '#aaa' : '#555'}
              keyboardType="email-address"
            />
          </Animated.View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </>
      ) : (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </>
      )}

      <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
        <Text style={styles.buttonText}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: 'dark' | 'light') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#191414' : '#fff',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    profilePic: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
      backgroundColor: '#ccc',
    },
    name: {
      fontSize: 24,
      color: theme === 'dark' ? '#fff' : '#000',
      marginBottom: 5,
    },
    email: {
      fontSize: 16,
      color: theme === 'dark' ? '#aaa' : '#555',
      marginBottom: 30,
    },
    input: {
      width: '100%',
      height: 45,
      borderColor: theme === 'dark' ? '#1DB954' : '#0a7d0a',
      borderWidth: 1,
      borderRadius: 25,
      marginBottom: 10,
      paddingHorizontal: 15,
      color: theme === 'dark' ? '#fff' : '#000',
      backgroundColor: theme === 'dark' ? 'transparent' : '#f2f2f2',
    },
    errorInput: {
      borderColor: '#ff4d4d',
    },
    errorText: {
      color: '#ff4d4d',
      fontSize: 12,
      marginBottom: 10,
      alignSelf: 'flex-start',
      paddingLeft: 10,
    },
    editButton: {
      backgroundColor: '#1DB954',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
