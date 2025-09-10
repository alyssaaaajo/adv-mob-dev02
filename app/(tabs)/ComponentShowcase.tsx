import { Image } from 'expo-image';
import { Platform, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import React from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabThreeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">as HnonoAghY with hair</ThemedText>
        </ThemedView>

        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={{ width: 200, height: 200 }}
        />

        <ThemedText>
          This is a frog.
        </ThemedText>
        <ThemedText>
          A frog that has hair.
        </ThemedText>
        <ThemedText>
          A bob cut hair.
        </ThemedText>
        <ThemedText>
          This app includes example code to help you get started.
        </ThemedText>


        <ThemedView style={[styles.stepContainer, { height: 200 }]}>
          <Button
            title="Show Message"
            onPress={() => Alert.alert("WOW!", "Your order has been delivered.")}
          />
        </ThemedView>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContent: {
    padding: 16,
  }
});