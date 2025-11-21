import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const playlists = [
  { id: "1", title: "The Winning - IU", cover: require("@/assets/images/iu.jpg") },
  { id: "2", title: "Music for Sleeping Princess", cover: require("@/assets/images/sleep.jpg") },
  { id: "3", title: "umiiyak ka? paiyakin pa kita", cover: require("@/assets/images/cey.jpg") },
  { id: "4", title: "Music for studyinggg", cover: require("@/assets/images/study.jpg") },
  { id: "5", title: "Relax ka muna", cover: require("@/assets/images/unwinding.jpg") },
  { id: "6", title: "Clean clean clean", cover: require("@/assets/images/clean.jpg") },
  { id: "7", title: "workout us", cover: require("@/assets/images/workout.jpg") },
  { id: "8", title: "Naruto playlist", cover: require("@/assets/images/naruto.jpg") },
];

const madeForYou = [
  { id: "1", title: "December Avenue, Dionela, Cup of Joe and more", cover: require("@/assets/images/coj.jpg"), label: "Daily Mix 02" },
  { id: "2", title: "Ed Sheeran, Adele, Lewis Capaldi and more", cover: require("@/assets/images/ed.jpg"), label: "Daily Mix 03" },
  { id: "3", title: "IV of Spades, Ben&Ben, and more", cover: require("@/assets/images/spades.jpg"), label: "Daily Mix 04" },
];

const yourTopMixes = [
  { id: "1", title: "IU, Sabrina Carpenter, Taylor Swift", cover: require("@/assets/images/iumix.jpg"), label: "Daily Mix 05" },
  { id: "2", title: "KATSEYE, UNIS, BlackPink", cover: require("@/assets/images/katseye1.jpg"), label: "Daily Mix 06" },
  { id: "3", title: "Relaxing Vibes", cover: require("@/assets/images/unwinding.jpg"), label: "Daily Mix 07" },
];

export default function PlaylistScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handlePress = (playlistId) => {
    router.push("AddSongs");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with Profile Picture */}
      <View style={styles.topHeader}>
        <Text style={styles.header}>Your Playlists</Text>
        <TouchableOpacity onPress={() => router.push("ProfileScreen")}>
          <Image
            source={require("@/assets/images/profile.jpg")}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Playlist Grid */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.playlistItem}
            onPress={() => handlePress(item.id)}
          >
            <Image source={item.cover} style={styles.coverImage} />
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Made For You Section */}
      <Text style={styles.sectionHeader}>Made For You</Text>
      <FlatList
        data={madeForYou}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.madeForYouItem}
            onPress={() => handlePress(item.id)}
          >
            <Image source={item.cover} style={styles.madeForYouImage} />
            <View style={styles.mixLabelContainer}>
              <Text style={styles.mixLabel}>{item.label}</Text>
            </View>
            <Text style={styles.madeForYouTitle} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Your Top Mixes Section (Independent) */}
      <Text style={styles.sectionHeader}>Your Top Mixes</Text>
      <FlatList
        data={yourTopMixes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.madeForYouItem}
            onPress={() => handlePress(item.id)}
          >
            <Image source={item.cover} style={styles.madeForYouImage} />
            <View style={styles.mixLabelContainer}>
              <Text style={styles.mixLabel}>{item.label}</Text>
            </View>
            <Text style={styles.madeForYouTitle} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#191414' : '#fff',
      padding: 15,
    },
    topHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    header: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 24,
      fontWeight: 'bold',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: '#1DB954',
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#282828' : '#f0f0f0',
      borderRadius: 12,
      marginBottom: 10,
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
    },
    title: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 14,
      flex: 1,
      flexWrap: 'wrap',
    },
    sectionHeader: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 25,
      marginBottom: 15,
    },
    madeForYouItem: {
      marginRight: 15,
      width: width * 0.45,
    },
    madeForYouImage: {
      width: '100%',
      height: 140,
      borderRadius: 8,
      marginBottom: 8,
    },
    madeForYouTitle: {
      color: theme === 'dark' ? '#ccc' : '#333',
      fontSize: 13,
    },
    mixLabelContainer: {
      position: 'absolute',
      bottom: 35,
      left: 5,
      backgroundColor: '#1DB954',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    mixLabel: {
      color: '#000',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });
