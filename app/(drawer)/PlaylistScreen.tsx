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
  { id: "1", title: "The Winning - IU", cover: require("@/assets/images/iu.png") },
  { id: "2", title: "Music for Sleeping Princess", cover: require("@/assets/images/sleep.png") },
  { id: "3", title: "umiiyak ka? paiyakin pa kita", cover: require("@/assets/images/cey.png") },
  { id: "4", title: "Music for studyinggg", cover: require("@/assets/images/study.png") },
  { id: "5", title: "Relax ka muna", cover: require("@/assets/images/unwinding.png") },
  { id: "6", title: "Clean clean clean", cover: require("@/assets/images/clean.png") },
  { id: "7", title: "workout us", cover: require("@/assets/images/workout.png") },
  { id: "8", title: "Naruto playlist", cover: require("@/assets/images/naruto.png") },
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
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => handlePress(item.id)}
          >
            <Image source={item.cover} style={styles.coverImage} />
            <Text
              style={styles.title}
              numberOfLines={1} // This will truncate the text if it overflows
              ellipsizeMode="tail" // Add ellipsis ("...") at the end of the text
            >
              {item.title}
            </Text>
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
      padding: 15,
    },
    header: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#282828' : '#f0f0f0',
      borderRadius: 12,
      paddingVertical: 0,
      paddingHorizontal: 0,
      marginBottom: 10, // Reduced vertical space between items
      flex: 1,
      shadowColor: theme === 'dark' ? '#000' : '#ccc',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
      marginRight: 7,
    },
    coverImage: {
      width: 55,
      height: 55,
      borderRadius: 8,
      marginRight: 15,
      borderColor: theme === 'dark' ? '#fff' : '#000',
    },
    title: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 14,
      flex: 1,
      flexWrap: 'wrap',
    },
  });
