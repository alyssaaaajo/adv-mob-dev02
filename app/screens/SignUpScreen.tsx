// screens/SignUpScreen.tsx
// screens/SignUpScreen.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";   // 👈 import router

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry />

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Link to login */}
      <TouchableOpacity onPress={() => router.push("/screens/SpotifyLogin")}>
        <Text style={styles.loginLink}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191414",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  loginLink: {
    color: "#1DB954",
    textAlign: "center",
    marginTop: 20,
  },
});
