import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // El iframe que proveíste integrado en un contenedor HTML para que se vea a pantalla completa
  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;background-color:black;display:flex;justify-content:center;align-items:center;height:100vh;">
        <iframe src="https://www.mp4upload.com/embed-duvjy1vdqd1e.html" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="100%" height="100%" allowfullscreen></iframe>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Reproduciendo</Text>
      </View>

      <WebView
        source={{ html: htmlContent }}
        style={{ flex: 1, backgroundColor: "black" }}
        allowsFullscreenVideo={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  backButton: { marginRight: 15 },
  headerText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
