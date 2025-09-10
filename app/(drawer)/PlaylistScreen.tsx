// screens/PlaylistScreen.tsx
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const playlists = [
  {
    id: '1',
    title: 'Chill Vibes',
    cover: require('@/assets/images/splash-icon.png'), // local image
  },
  {
    id: '2',
    title: 'Workout Mix',
    cover: require('@/assets/images/adaptive-icon.png'),
  },
  {
    id: '3',
    title: 'Top Hits',
    cover: require('@/assets/images/icon.png'),
  },
];

export default function PlaylistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playlistItem}>
            <Image source={item.cover} style={styles.coverImage} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

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