
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabFourScreen() {
    const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      {/* Top Section: Logo + Title */}
      <View style={styles.topSection}>
        <Image
          source={require('@/assets/images/spotify.png')}
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.title}>Spotify</ThemedText>
      </View>

      {/* Bottom Section: Inputs + Forgot Password */}
      <View style={styles.bottomSection}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#555555"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#555555"
            secureTextEntry
          />
        </View>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.bottomButton}
      onPress={() => router.replace('/(drawer)/PlaylistScreen')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Connect With Section */}
      <View style={styles.connectSection}>
        <Text style={styles.connectText}>Connect with</Text>
        <View style={styles.socialLogos}>
          <TouchableOpacity>
            <FontAwesome name="facebook" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="google" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Sign Up Text */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <TouchableOpacity onPress={() => router.push('/screens/SignUpScreen')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    justifyContent: 'space-between',
    padding: 20
  },
  topSection: {
    alignItems: 'center',
    marginTop: 100
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: '500',
  },
  bottomSection: {
    width: '100%',
    marginBottom: 100
  },
  input: {
    width: '75%',
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
    marginBottom: 12,
    alignSelf: 'center',
    color: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  forgotContainer: {
    width: '75%',
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginTop: 4
  },
  forgotText: {
    color: '#555555',
    fontSize: 14,
    fontWeight: '500'
  },
  bottomButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    width: '75%',
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: -100, // Moves button closer to inputs
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  connectSection: {
    alignItems: 'center',
    marginTop: 20
  },
  connectText: {
    color: '#1DB954',
    fontSize: 14,
    marginBottom: 10
  },
  socialLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20
  },
  socialLogo: {
    width: 30,
    height: 30,
    marginHorizontal: 10
  },
  signupContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 70
    },
    signupText: {
      color: '#FFFFFF',
      fontSize: 14,
    },
    signupLink: {
      color: '#1DB954',
      fontWeight: 'bold'
    }
});
