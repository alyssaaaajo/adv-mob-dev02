import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker, Circle } from "react-native-maps";
import { mapStyles, MapStyleType } from "./mapStyles"; // Import the styles

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [enteredZones, setEnteredZones] = useState(new Set<string>());
  const [currentStyle, setCurrentStyle] = useState<MapStyleType>("dark");
  const [showStylePicker, setShowStylePicker] = useState(false);

  const [location, setLocation] = useState({
    latitude: 10.3157,
    longitude: 123.8854,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const POI = [
    {
      id: "1",
      title: "Checkpoint A",
      latitude: 10.3163,
      longitude: 123.887,
    },
    {
      id: "2",
      title: "Checkpoint B",
      latitude: 10.3171,
      longitude: 123.8835,
    },
    {
      id: "3",
      title: "Checkpoint C",
      latitude: 10.3149,
      longitude: 123.8844,
    },
  ];

  // Request location permissions
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs access to your location.",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Track location with geofencing
  useEffect(() => {
    requestLocationPermission().then((hasPermission) => {
      if (!hasPermission) return;

      const watchId = Geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          setLocation((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));

          // Geofencing with entry/exit tracking
          POI.forEach((area) => {
            const distance = getDistance(
              latitude,
              longitude,
              area.latitude,
              area.longitude
            );

            if (distance < 100 && !enteredZones.has(area.id)) {
              Alert.alert("Geofence Alert", `You entered ${area.title}`);
              setEnteredZones((prev) => new Set(prev).add(area.id));
            } else if (distance >= 100 && enteredZones.has(area.id)) {
              setEnteredZones((prev) => {
                const next = new Set(prev);
                next.delete(area.id);
                return next;
              });
            }
          });
        },
        (err) => console.log(err),
        {
          enableHighAccuracy: true,
          interval: 2000,
          distanceFilter: 2,
        }
      );

      return () => Geolocation.clearWatch(watchId);
    });
  }, []);

  // Calculate distance in meters (Haversine formula)
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Style switching handler
  const handleStyleChange = (styleName: MapStyleType) => {
    setCurrentStyle(styleName);
    setShowStylePicker(false);
  };

  // Style button configurations
  const styleButtons = [
    { name: "dark" as MapStyleType, label: "Dark Mode", emoji: "🌙" },
    { name: "retro" as MapStyleType, label: "Retro", emoji: "🕰️" },
    { name: "night" as MapStyleType, label: "Night", emoji: "🌃" },
    { name: "aubergine" as MapStyleType, label: "Aubergine", emoji: "🍆" },
    { name: "highContrast" as MapStyleType, label: "High Contrast", emoji: "⚡" },
  ];

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyles[currentStyle]}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
      >
        {/* POI Markers */}
        {POI.map((item) => (
          <Marker
            key={item.id}
            title={item.title}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          />
        ))}

        {/* Geofence Circles */}
        {POI.map((item) => (
          <Circle
            key={item.id + "_circle"}
            center={{ latitude: item.latitude, longitude: item.longitude }}
            radius={100}
            strokeWidth={2}
            strokeColor="#ffffff88"
            fillColor="#00ff0030"
          />
        ))}
      </MapView>

      {/* Style Toggle Button */}
      <TouchableOpacity
        style={styles.styleButton}
        onPress={() => setShowStylePicker(!showStylePicker)}
      >
        <Text style={styles.styleButtonText}>🎨 Map Style</Text>
      </TouchableOpacity>

      {/* Style Picker Panel */}
      {showStylePicker && (
        <View style={styles.stylePickerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {styleButtons.map((style) => (
              <TouchableOpacity
                key={style.name}
                style={[
                  styles.styleOption,
                  currentStyle === style.name && styles.styleOptionActive,
                ]}
                onPress={() => handleStyleChange(style.name)}
              >
                <Text style={styles.styleEmoji}>{style.emoji}</Text>
                <Text style={styles.styleLabel}>{style.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  styleButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  styleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  stylePickerContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    backgroundColor: "#ffffffee",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  styleOption: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    minWidth: 100,
    borderWidth: 2,
    borderColor: "transparent",
  },
  styleOptionActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#2E7D32",
  },
  styleEmoji: {
    fontSize: 28,
    marginBottom: 5,
  },
  styleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
});