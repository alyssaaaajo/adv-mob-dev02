import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const playlists = [
  { id: "1", title: "Chill Vibes", cover: require("@/assets/images/splash-icon.png") },
  { id: "2", title: "Workout Mix", cover: require("@/assets/images/adaptive-icon.png") },
  { id: "3", title: "Top Hits", cover: require("@/assets/images/icon.png") },
  { id: "4", title: "Party Time", cover: require("@/assets/images/splash-icon.png") },
  { id: "5", title: "Focus", cover: require("@/assets/images/adaptive-icon.png") },
  { id: "6", title: "Sleep", cover: require("@/assets/images/icon.png") },
  { id: "7", title: "Jazz Classics", cover: require("@/assets/images/splash-icon.png") },
  { id: "8", title: "Rock Legends", cover: require("@/assets/images/adaptive-icon.png") },
];

export default function PlaylistScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const handlePress = (playlistId: string) => {
    router.push(`AddSongs`);
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => handlePress(item.id)}
          >
            <Image source={item.cover} style={styles.coverImage} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const getStyles = (theme: 'dark' | 'light') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#191414' : '#fff',
      padding: 20,
    },
    header: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 24,
      marginBottom: 20,
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      backgroundColor: theme === 'dark' ? '#282828' : '#f0f0f0',
      borderRadius: 8,
      padding: 10,
      flex: 1,
      marginHorizontal: 5,
    },
    coverImage: {
      width: 60,
      height: 60,
      borderRadius: 5,
      marginRight: 15,
    },
    title: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
    },
  });
