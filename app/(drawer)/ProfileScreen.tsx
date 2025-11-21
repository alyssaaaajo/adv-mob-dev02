import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, View, Text, TextInput, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSharedValue, withTiming, withSequence, withRepeat, useAnimatedStyle } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import { useTheme } from "../../src/contexts/ThemeContext";


export default function ProfileScreen() {
  const router = useRouter();

  // Saved profile state
  const [profileUsername, setProfileUsername] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Draft states (for modal editing)
  const [draftUsername, setDraftUsername] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftImage, setDraftImage] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const fadeIn = useSharedValue(0);
  const shakeAnimation = useSharedValue(0);

  const profileImageOpacity = useAnimatedStyle(() => {
    return { opacity: withTiming(fadeIn.value, { duration: 500 }) };
  });

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withRepeat(
            withSequence(withTiming(-10), withTiming(10), withTiming(-10), withTiming(10)),
            2,
            false
          )
        }
      ]
    };
  });

  useEffect(() => {
    if (modalVisible) fadeIn.value = 1;
  }, [modalVisible]);

  // Load saved profile data from AsyncStorage
  useEffect(() => {
    const loadProfileData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedImage = await AsyncStorage.getItem('profileImage');

      setProfileUsername(storedUsername || 'Akaza');
      setProfileEmail(storedEmail || 'akaza_011@dmnslayer.com');
      setProfileImage(storedImage);
    };
    loadProfileData();
  }, []);

  // Open modal with current saved profile copied into drafts
  const handleOpenModal = () => {
    setDraftUsername(profileUsername);
    setDraftEmail(profileEmail);
    setDraftImage(profileImage);
    setModalVisible(true);
  };

  // Cancel editing -> discard drafts
  const handleCloseModal = () => {
    setDraftUsername(profileUsername);
    setDraftEmail(profileEmail);
    setDraftImage(profileImage);
    setModalVisible(false);
  };

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus.status !== 'granted' || libraryStatus.status !== 'granted') {
      Alert.alert('Permission required', 'Camera and photo library permissions are required.');
      return false;
    }
    return true;
  };

  const saveImage = async (uri: string) => {
    try {
      const filename = uri.split('/').pop();
      const newPath = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({ from: uri, to: newPath });
      return newPath;
    } catch (err) {
      console.error('Failed to save image:', err);
      return null;
    }
  };

  // Pick or snap image (draft only)
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: async () => {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            const newPath = await saveImage(uri);
            if (newPath) setDraftImage(newPath);
          }
        }
      },
      {
        text: 'Gallery',
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            const newPath = await saveImage(uri);
            if (newPath) setDraftImage(newPath);
          }
        }
      },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;

    if (!draftUsername.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setUsernameError('Username must be 3-20 characters, alphanumeric or underscores only.');
      isValid = false;
      shakeAnimation.value = withRepeat(
        withSequence(withTiming(-10), withTiming(10), withTiming(-10), withTiming(10)),
        2,
        false
      );
    } else {
      setUsernameError('');
    }

    if (!draftEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
      shakeAnimation.value = withRepeat(
        withSequence(withTiming(-10), withTiming(10), withTiming(-10), withTiming(10)),
        2,
        false
      );
    } else {
      setEmailError('');
    }

    return isValid;
  };

  // Save draft -> commit to saved profile and AsyncStorage
  const handleSubmit = async () => {
    if (validateForm()) {
      await AsyncStorage.setItem('username', draftUsername);
      await AsyncStorage.setItem('email', draftEmail);
      if (draftImage) await AsyncStorage.setItem('profileImage', draftImage);

      setProfileUsername(draftUsername);
      setProfileEmail(draftEmail);
      setProfileImage(draftImage);

      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 55, left: 15, zIndex: 10 }}
        onPress={() => router.push('../(tabs)')}
      >
        <MaterialIcons name="arrow-back-ios-new" size={20} color="#ffffffc4" />
      </TouchableOpacity>

      <LinearGradient
        colors={['#9a7183ff', '#121212']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ width: '100%', height: '30%', justifyContent: 'center', marginBottom: 30 }}
      >
        <View style={styles.logoRow}>
          <Image
            source={profileImage ? { uri: profileImage } : require('@/assets/images/naruto.jpg')}
            style={styles.imagePlaceholder}
          />
          <View style={[profileImageOpacity]}>
            <Text style={styles.title}>{profileUsername}</Text>
            <Text style={styles.subtitle}>{profileEmail}</Text>
            <Text style={styles.counter}>230.3k followers ⋅ 13 following</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25, top: -20, left: 15 }}>

        {/* EDIT BUTTON */}
        <TouchableOpacity style={styles.Button} onPress={handleOpenModal}>
          <Text style={styles.loginText}>Edit</Text>
        </TouchableOpacity>

        {/* NEW MAP BUTTON */}
        <TouchableOpacity
          style={[styles.Button, { width: "25%", borderColor: "#1DB954" }]}
          onPress={() => router.push("MapScreen")}
        >
          <Text style={styles.loginText}>Map</Text>
        </TouchableOpacity>

      </View>


      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 20 }}>
              <Image
                source={draftImage ? { uri: draftImage } : require('@/assets/images/naruto.jpg')}
                style={[
                  styles.imagePlaceholder,
                  { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#1DB954' }
                ]}
              />
              <Text style={{ color: '#1DB954', textAlign: 'center', marginTop: 8 }}>Change Photo</Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.input, usernameError && styles.inputError]}
              placeholder="Username"
              value={draftUsername}
              onChangeText={setDraftUsername}
            />
            {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Email"
              value={draftEmail}
              onChangeText={setDraftEmail}
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.loginText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
              <Text style={styles.loginText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  logoRow: {
    flexDirection: 'row',
    marginTop: '25%',
    alignItems: 'center',
    marginVertical: 10,
    left: 15,
    gap: 20
  },
  title: { fontWeight: 'bold', color: '#fff', fontSize: 30 },
  subtitle: { color: '#8d8d8dff', fontSize: 12 },
  counter: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  imagePlaceholder: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
    borderRadius: 60,
    backgroundColor: '#333'
  },
  input: {
    width: '95%',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 20,
    color: '#fff',
    marginBottom: 20
  },
  inputError: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', fontSize: 12, alignSelf: 'center', marginBottom: 10 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  modalContainer: {
    backgroundColor: '#121212',
    padding: 30,
    borderRadius: 10,
    width: '80%'
  },
  modalTitle: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center' },
  submitButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15
  },
  cancelButton: {
    backgroundColor: '#6e6e6eff',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10
  },
  Button: {
    backgroundColor: 'transparent',
    width: '17%',
    padding: 6,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#6e6e6eff'
  },
  loginText: { color: '#fff', fontWeight: 'bold' }
});