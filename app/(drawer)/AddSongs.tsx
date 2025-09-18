import React, { useReducer, useEffect, useState } from "react";
import 'react-native-reanimated';
import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";


import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🎶 Playlist Actions
type Action =
  | { type: "ADD"; song: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "UNDO" }
  | { type: "REDO" };

type Song = { id: string; title: string };

type State = {
  past: Song[][];
  present: Song[];
  future: Song[][];
};

const initialState: State = {
  past: [],
  present: [],
  future: [],
};

function reducer(state: State, action: Action): State {
  const { past, present, future } = state;
  switch (action.type) {
    case "ADD": {
      const newPresent = [
        ...present,
        { id: Date.now().toString(), title: action.song },
      ];
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }
    case "REMOVE": {
      const newPresent = present.filter((song) => song.id !== action.id);
      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }
    case "CLEAR": {
      return {
        past: [...past, present],
        present: [],
        future: [],
      };
    }
    case "UNDO": {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    case "REDO": {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }
    default:
      return state;
  }
}

export default function PlaylistScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState("");

  // ✅ Load from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem("playlistState");
      if (saved) {
        dispatch({ type: "CLEAR" }); // reset
        const parsed: State = JSON.parse(saved);
        parsed.present.forEach((song) =>
          dispatch({ type: "ADD", song: song.title })
        );
      }
    };
    loadData();
  }, []);

  // ✅ Save to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem("playlistState", JSON.stringify(state));
  }, [state]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎵 Playlist Manager</Text>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter song name"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (input.trim()) {
              dispatch({ type: "ADD", song: input });
              setInput("");
            }
          }}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => dispatch({ type: "UNDO" })}
        >
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => dispatch({ type: "REDO" })}
        >
          <Text style={styles.buttonText}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => dispatch({ type: "CLEAR" })}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Playlist */}
      <FlatList
        data={state.present}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={styles.deleteButton}>
                <MaterialIcons
                  name="delete"
                  size={30}
                  color="red"
                  onPress={() => dispatch({ type: "REMOVE", id: item.id })}
                />
              </View>
            )}
          >
            <View style={styles.songItem}>
              <Text style={styles.songText}>{item.title}</Text>
            </View>
          </Swipeable>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#191414", padding: 20 },
  header: { color: "#fff", fontSize: 24, marginBottom: 20 },
  inputRow: { flexDirection: "row", marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  actionButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
  },
  songItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#282828",
    borderRadius: 5,
    marginBottom: 10,
  },
  songText: { color: "#fff", fontSize: 16 },
  removeText: { color: "#f55", fontSize: 16 },
});

