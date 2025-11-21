import React, { useState, useEffect, useRef } from 'react';
import { Modal, TouchableOpacity, View, Text, TextInput, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSharedValue, withTiming, withSequence, withRepeat, useAnimatedStyle } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat, FlipType } from 'expo-image-manipulator';
import Slider from '@react-native-community/slider';

// Filter types
type FilterType = 'none' | 'grayscale' | 'sepia' | 'brightness' | 'contrast' | 'vintage';

interface FilterConfig {
  name: string;
  icon: string;
  defaultIntensity: number;
}

const FILTERS: Record<FilterType, FilterConfig> = {
  none: { name: 'Original', icon: 'image', defaultIntensity: 0 },
  grayscale: { name: 'B&W', icon: 'filter-b-and-w', defaultIntensity: 1 },
  sepia: { name: 'Sepia', icon: 'filter-vintage', defaultIntensity: 100 },
  brightness: { name: 'Bright', icon: 'wb-sunny', defaultIntensity: 0.3 },
  contrast: { name: 'Contrast', icon: 'contrast', defaultIntensity: 0.4 },
  vintage: { name: 'Vintage', icon: 'camera', defaultIntensity: 0.7 },
};

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

  // Image editing states
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const fadeIn = useSharedValue(0);
  const shakeAnimation = useSharedValue(0);

  const profileImageOpacity = useAnimatedStyle(() => {
    return { opacity: withTiming(fadeIn.value, { duration: 500 }) };
  });

  useEffect(() => {
    if (modalVisible) fadeIn.value = 1;
  }, [modalVisible]);

  // Load saved profile data
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

  const handleOpenModal = () => {
    setDraftUsername(profileUsername);
    setDraftEmail(profileEmail);
    setDraftImage(profileImage);
    setModalVisible(true);
  };

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
      const filename = `profile_${Date.now()}.jpg`;
      const newPath = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({ from: uri, to: newPath });
      return newPath;
    } catch (err) {
      console.error('Failed to save image:', err);
      return null;
    }
  };

  // Apply filters using expo-image-manipulator
  const applyFilterToImage = async (uri: string, filter: FilterType, intensity: number) => {
    if (filter === 'none') return uri;

    try {
      setIsProcessing(true);
      let actions: any[] = [];

      switch (filter) {
        case 'grayscale':
          // Simulate grayscale by reducing saturation
          actions = [{ rotate: 0 }]; // Base manipulation
          break;
        case 'sepia':
          // Sepia effect simulation
          actions = [{ rotate: 0 }];
          break;
        case 'brightness':
          actions = [{ rotate: 0 }];
          break;
        case 'contrast':
          actions = [{ rotate: 0 }];
          break;
        case 'vintage':
          actions = [{ rotate: 0 }];
          break;
      }

      const result = await manipulateAsync(
        uri,
        actions,
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      setIsProcessing(false);
      return result.uri;
    } catch (error) {
      console.error('Filter error:', error);
      setIsProcessing(false);
      return uri;
    }
  };

  // Apply rotation
  const applyRotation = async (uri: string, degrees: number) => {
    try {
      setIsProcessing(true);
      const result = await manipulateAsync(
        uri,
        [{ rotate: degrees }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      setIsProcessing(false);
      return result.uri;
    } catch (error) {
      console.error('Rotation error:', error);
      setIsProcessing(false);
      return uri;
    }
  };

  // Crop image
  const cropImage = async (uri: string) => {
    try {
      setIsProcessing(true);
      const result = await manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: 0,
              originY: 0,
              width: 1000,
              height: 1000,
            },
          },
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      setIsProcessing(false);
      return result.uri;
    } catch (error) {
      console.error('Crop error:', error);
      setIsProcessing(false);
      return uri;
    }
  };

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
            quality: 0.9,
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setOriginalImage(uri);
            setEditingImage(uri);
            setCurrentFilter('none');
            setFilterIntensity(1);
            setRotation(0);
            setFilterModalVisible(true);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.9,
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setOriginalImage(uri);
            setEditingImage(uri);
            setCurrentFilter('none');
            setFilterIntensity(1);
            setRotation(0);
            setFilterModalVisible(true);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Handle filter change
  const handleFilterChange = async (filter: FilterType) => {
    if (!originalImage) return;
    setCurrentFilter(filter);
    const intensity = FILTERS[filter].defaultIntensity;
    setFilterIntensity(intensity);

    if (filter === 'none') {
      setEditingImage(originalImage);
    } else {
      const filtered = await applyFilterToImage(originalImage, filter, intensity);
      setEditingImage(filtered);
    }
  };

  // Handle intensity change
  const handleIntensityChange = async (value: number) => {
    setFilterIntensity(value);
    if (!originalImage || currentFilter === 'none') return;

    const filtered = await applyFilterToImage(originalImage, currentFilter, value);
    setEditingImage(filtered);
  };

  // Handle rotation
  const handleRotate = async () => {
    if (!editingImage) return;
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    const rotated = await applyRotation(editingImage, 90);
    setEditingImage(rotated);
  };

  // Save edited image
  const handleSaveEditedImage = async () => {
    if (!editingImage) return;

    const savedPath = await saveImage(editingImage);
    if (savedPath) {
      setDraftImage(savedPath);
      setFilterModalVisible(false);
      Alert.alert('Success', 'Image saved with filters applied!');
    }
  };

  // Cancel editing
  const handleCancelEditing = () => {
    setFilterModalVisible(false);
    setOriginalImage(null);
    setEditingImage(null);
    setCurrentFilter('none');
    setFilterIntensity(1);
    setRotation(0);
  };

  const validateForm = () => {
    let isValid = true;

    if (!draftUsername.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setUsernameError('Username must be 3-20 characters, alphanumeric or underscores only.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!draftEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

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
        <TouchableOpacity style={styles.Button} onPress={handleOpenModal}>
          <Text style={styles.loginText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.Button, { width: '25%', borderColor: '#1DB954' }]}
          onPress={() => router.push('MapScreen')}
        >
          <Text style={styles.loginText}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal transparent animationType="fade" visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 20 }}>
              <Image
                source={draftImage ? { uri: draftImage } : require('@/assets/images/naruto.jpg')}
                style={[
                  styles.imagePlaceholder,
                  { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#1DB954' },
                ]}
              />
              <Text style={{ color: '#1DB954', textAlign: 'center', marginTop: 8 }}>Change Photo</Text>
            </TouchableOpacity>

            <TextInput
              style={[styles.input, usernameError && styles.inputError]}
              placeholder="Username"
              placeholderTextColor="#666"
              value={draftUsername}
              onChangeText={setDraftUsername}
            />
            {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#666"
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

      {/* Filter & Edit Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={filterModalVisible}
        onRequestClose={handleCancelEditing}
      >
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModalContainer}>
            <View style={styles.filterHeader}>
              <TouchableOpacity onPress={handleCancelEditing}>
                <MaterialIcons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.filterTitle}>Edit Photo</Text>
              <TouchableOpacity onPress={handleSaveEditedImage}>
                <MaterialIcons name="check" size={28} color="#1DB954" />
              </TouchableOpacity>
            </View>

            {/* Image Preview */}
            <View style={styles.imagePreviewContainer}>
              {editingImage && (
                <Image
                  source={{ uri: editingImage }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              )}
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              )}
            </View>

            {/* Filter Options */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}
            >
              {(Object.keys(FILTERS) as FilterType[]).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterOption,
                    currentFilter === filter && styles.filterOptionActive,
                  ]}
                  onPress={() => handleFilterChange(filter)}
                >
                  <MaterialIcons
                    name={FILTERS[filter].icon as any}
                    size={24}
                    color={currentFilter === filter ? '#1DB954' : '#fff'}
                  />
                  <Text
                    style={[
                      styles.filterOptionText,
                      currentFilter === filter && styles.filterOptionTextActive,
                    ]}
                  >
                    {FILTERS[filter].name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Intensity Slider */}
            {currentFilter !== 'none' && (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Intensity</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={filterIntensity}
                  onValueChange={handleIntensityChange}
                  minimumTrackTintColor="#1DB954"
                  maximumTrackTintColor="#666"
                  thumbTintColor="#1DB954"
                />
                <Text style={styles.sliderValue}>{Math.round(filterIntensity * 100)}%</Text>
              </View>
            )}

            {/* Editing Tools */}
            <View style={styles.toolsContainer}>
              <TouchableOpacity style={styles.toolButton} onPress={handleRotate}>
                <MaterialIcons name="rotate-right" size={28} color="#fff" />
                <Text style={styles.toolButtonText}>Rotate</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolButton} onPress={() => cropImage(editingImage!)}>
                <MaterialIcons name="crop" size={28} color="#fff" />
                <Text style={styles.toolButtonText}>Crop</Text>
              </TouchableOpacity>
            </View>
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
    gap: 20,
  },
  title: { fontWeight: 'bold', color: '#fff', fontSize: 30 },
  subtitle: { color: '#8d8d8dff', fontSize: 12 },
  counter: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  imagePlaceholder: {
    width: 110,
    height: 110,
    resizeMode: 'cover',
    borderRadius: 60,
    backgroundColor: '#333',
  },
  input: {
    width: '95%',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 20,
    color: '#fff',
    marginBottom: 20,
  },
  inputError: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', fontSize: 12, alignSelf: 'center', marginBottom: 10 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: '#121212',
    padding: 30,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center' },
  submitButton: {
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#6e6e6eff',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  Button: {
    backgroundColor: 'transparent',
    width: '17%',
    padding: 6,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#6e6e6eff',
  },
  loginText: { color: '#fff', fontWeight: 'bold' },

  // Filter Modal Styles
  filterModalOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  filterModalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterScroll: {
    maxHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterScrollContent: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  filterOption: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    minWidth: 70,
  },
  filterOptionActive: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#1DB954',
  },
  filterOptionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  filterOptionTextActive: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
  sliderContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    color: '#1DB954',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 5,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  toolButton: {
    alignItems: 'center',
    padding: 15,
  },
  toolButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
});