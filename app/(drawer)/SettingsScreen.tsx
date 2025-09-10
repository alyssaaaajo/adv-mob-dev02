// screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function SettingsScreen({ navigation }) {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    navigation.navigate('SpotifyLogin'); // Adjust route name as needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor="#1DB954"
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor="#1DB954"
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/screens/SpotifyLogin')}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    padding: 20
  },
  header: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 30
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  label: {
    color: '#fff',
    fontSize: 16
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center'
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold'
  }
});