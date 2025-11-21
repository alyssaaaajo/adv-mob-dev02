import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';  // adjust path as needed

export default function DrawerLayout() {
  const { theme } = useTheme();

  // Define drawer styles based on theme
  const drawerStyle = {
    backgroundColor: theme === 'dark' ? '#191414' : '#fff',
  };

  const drawerActiveTintColor = theme === 'dark' ? '#1DB954' : '#1DB954';
  const drawerInactiveTintColor = theme === 'dark' ? '#aaa' : '#555';

  return (
    <Drawer
      screenOptions={{
        drawerStyle,
        drawerActiveTintColor,
        drawerInactiveTintColor,
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#191414' : '#fff',
        },
        headerTintColor: theme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Drawer.Screen
        name="PlaylistScreen"
        options={{
          title: 'Playlist',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="SettingsScreen"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
              name="MapScreen"
              options={{
                title: 'Map',
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="settings" size={size} color={color} />
                ),
              }}
            />
    </Drawer>
  );
}
