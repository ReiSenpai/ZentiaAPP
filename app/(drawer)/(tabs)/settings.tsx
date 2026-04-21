import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 1. Definimos la interfaz para TypeScript
interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap; // Esto hace que el nombre del icono sea válido
  title: string;
  color?: string;
  onPress?: () => void;
}

// 2. Componente de cada fila
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
  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir de ZentiaAPP?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => console.log("Logout"),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header estilo minimalista */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Más</Text>
      </View>

      {/* Perfil */}
      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={styles.profileName}>Usuario</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <SettingItem icon="mail-outline" title="Cuenta" />
        <SettingItem icon="help-circle-outline" title="Ayuda" />
      </View>

      <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Versión 1.0.4 (ZentiaAPP)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Negro absoluto de fondo
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#1db954", // Puedes cambiar por el color de tu avatar
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  section: {
    marginTop: 20,
  },
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
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "400",
  },
  logoutContainer: {
    marginTop: 40,
    alignItems: "center",
    paddingVertical: 15,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  versionText: {
    textAlign: "center",
    color: "#555",
    fontSize: 12,
    marginBottom: 40,
  },
});
