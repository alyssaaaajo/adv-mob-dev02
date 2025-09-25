// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { ThemeProvider } from './contexts/ThemeContext';


import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null; // Wait for fonts to load
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="screens/SignUpScreen">
        <Stack.Screen
          name="screens/SignUpScreen"
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="screens/SpotifyLogin"
          options={{ title: "Spotify Login" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
//
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Stack } from "expo-router";
//
// export default function RootLayout() {
//   return (
//     <Stack initialRouteName="screens/SignUpScreen">
//       <Stack.Screen name="screens/SignUpScreen" options={{ title: "Sign Up" }} />
//       <Stack.Screen name="screens/SpotifyLogin" options={{ title: "Spotify Login" }} />
//     </Stack>
//   );
// }
//
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });
//
//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }
//
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="screens" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }