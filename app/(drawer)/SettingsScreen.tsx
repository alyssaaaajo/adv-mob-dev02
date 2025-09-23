import React from 'react';
import { useTheme } from '../contexts/ThemeContext';


import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';


export default function SettingsScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  const isDarkMode = theme === 'dark';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#191414' : '#fff' },
      ]}
    >
      <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#000' }]}>
        Settings
      </Text>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>
          Notifications
        </Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          thumbColor="#1DB954"
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor="#1DB954"
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push('/screens/SpotifyLogin')}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#1DB954',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
