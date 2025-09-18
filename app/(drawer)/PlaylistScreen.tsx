// screens/PlaylistScreen.tsx
import React from 'react';

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
    const numColumns = 2;


  const handlePress = (playlistId: string) => {
    // Navigate to a new screen, passing the playlistId as param
    router.push(`AddSongs`);
  };

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

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#fff" },
//   header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
//   playlistItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: "#f0f0f0",
//   },
//   coverImage: { width: 50, height: 50, marginRight: 12, borderRadius: 8 },
//   title: { fontSize: 18 },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});