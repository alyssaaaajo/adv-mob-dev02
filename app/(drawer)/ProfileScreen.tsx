import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export default function ProfileScreen() {
  const [name, setName] = useState('Akaza');
  const [email, setEmail] = useState('relapseGodz@email.com');
  const [isEditing, setIsEditing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { theme } = useTheme();

  const shake = useSharedValue(0);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

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
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/profile.jpg')}
        style={styles.profilePic}
      />

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
      marginBottom: 20,
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
