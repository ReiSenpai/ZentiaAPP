import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color?: string;
  onPress?: () => void;
}

const SettingItem = ({
  icon,
  title,
  color = "#fff",
  onPress,
}: SettingItemProps) => (
  <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.itemLeft}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.itemText, { color }]}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#555" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuario");

  // SE ACTUALIZA CADA VEZ QUE ENTRAS A AJUSTES
  useFocusEffect(
    React.useCallback(() => {
      const loadName = async () => {
        try {
          const userDataStr = await AsyncStorage.getItem("@user_data");
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            setUserName(userData.name || "Usuario");
          }
        } catch (e) {
          console.log("Error loading name");
        }
      };
      loadName();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir de ZentiaAPP?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            // Te devuelve al login
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Más</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{userName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        {/* NAVEGA A LA PANTALLA DE PERFIL QUE CREAMOS */}
        <SettingItem
          icon="person-outline"
          title="Editar Perfil"
          onPress={() => router.push("/profile")}
        />
        <SettingItem icon="mail-outline" title="Cuenta" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración de la app</Text>
        <SettingItem icon="notifications-outline" title="Notificaciones" />
        <SettingItem icon="download-outline" title="Mis descargas" />
        <SettingItem
          icon="settings-outline"
          title="Configuración de reproducción"
        />
      </View>

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Versión 1.0.4 (ZentiaAPP)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 60, paddingHorizontal: 15, paddingBottom: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#E50914",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    textTransform: "capitalize",
  },
  section: { marginTop: 20 },
  sectionTitle: {
    color: "#a3a3a3",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#121212",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  itemText: { fontSize: 16, marginLeft: 15, fontWeight: "400" },
  logoutContainer: { marginTop: 40, alignItems: "center", paddingVertical: 15 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  versionText: {
    textAlign: "center",
    color: "#555",
    fontSize: 12,
    marginBottom: 40,
  },
});
