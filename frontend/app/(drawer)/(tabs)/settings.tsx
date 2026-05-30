import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
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
  const [profileImage, setProfileImage] = useState("");

  // MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState("");

  // SWITCHES
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);

  // NUEVOS STATES
  const [videoQuality, setVideoQuality] = useState("1080p");
  const [playbackSpeed, setPlaybackSpeed] = useState("1.5x");

  useFocusEffect(
    React.useCallback(() => {
      const loadName = async () => {
        try {
          const userDataStr = await AsyncStorage.getItem("@user_data");

          if (userDataStr) {
            const userData = JSON.parse(userDataStr);

            setUserName(userData.name || "Usuario");
            setProfileImage(userData.profileImage || "");
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
            router.replace("/(auth)/login");
          },
        },
      ],
    );
  };

  const openSection = (section: string) => {
    setCurrentSection(section);
    setModalVisible(true);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Más</Text>
        </View>

        <View style={styles.profileSection}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <Text style={styles.profileName}>{userName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>

          <SettingItem
            icon="person-outline"
            title="Editar Perfil"
            onPress={() => router.push("/profile")}
          />

          <SettingItem
            icon="mail-outline"
            title="Cuenta"
            onPress={() =>
              Alert.alert("Cuenta", "Tu cuenta Premium está activa ✅")
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración de la app</Text>

          <SettingItem
            icon="notifications-outline"
            title="Notificaciones"
            onPress={() => openSection("notifications")}
          />

          <SettingItem
            icon="download-outline"
            title="Mis descargas"
            onPress={() => openSection("downloads")}
          />

          <SettingItem
            icon="settings-outline"
            title="Configuración de reproducción"
            onPress={() => openSection("playback")}
          />
        </View>

        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versión 1.0.4 (ZentiaAPP)</Text>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* NOTIFICACIONES */}
            {currentSection === "notifications" && (
              <>
                <Text style={styles.modalTitle}>Notificaciones</Text>

                <View style={styles.notificationCard}>
                  <Ionicons name="notifications" size={22} color="#E50914" />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.notificationTitle}>ZentiaAPP</Text>

                    <Text style={styles.notificationText}>
                      Oye, felicidades por entrar diario a ZentiaAPP 🎉 Muchas
                      gracias por apoyarnos.
                    </Text>
                  </View>
                </View>

                <View style={styles.notificationCard}>
                  <Ionicons name="film" size={22} color="#E50914" />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.notificationTitle}>Nuevo estreno</Text>

                    <Text style={styles.notificationText}>
                      Interstellar ahora disponible en HD 🚀
                    </Text>
                  </View>
                </View>

                <View style={styles.notificationCard}>
                  <Ionicons name="flame" size={22} color="#E50914" />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.notificationTitle}>
                      Tendencia mundial
                    </Text>

                    <Text style={styles.notificationText}>
                      Dark está siendo la serie más vista 🔥
                    </Text>
                  </View>
                </View>

                <View style={styles.notificationCard}>
                  <Ionicons name="download" size={22} color="#E50914" />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.notificationTitle}>
                      Descarga completada
                    </Text>

                    <Text style={styles.notificationText}>
                      The Batman ya está disponible sin conexión.
                    </Text>
                  </View>
                </View>

                <View style={styles.notificationCard}>
                  <Ionicons name="tv" size={22} color="#E50914" />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.notificationTitle}>
                      Continúa viendo
                    </Text>

                    <Text style={styles.notificationText}>
                      Tienes una película pendiente 🍿
                    </Text>
                  </View>
                </View>

                <View style={styles.notificationCard}>
                  <Ionicons name="star" size={22} color="#E50914" />

                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.notificationTitle}>
                      Recomendación para ti
                    </Text>

                    <Text style={styles.notificationText}>
                      Basado en tus gustos te recomendamos Stranger Things ⭐
                    </Text>
                  </View>
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>Activar notificaciones</Text>

                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                  />
                </View>
              </>
            )}

            {/* DESCARGAS */}
            {currentSection === "downloads" && (
              <>
                <Text style={styles.modalTitle}>Mis Descargas</Text>

                <View style={styles.downloadCard}>
                  <Ionicons name="download" size={24} color="#E50914" />

                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.downloadTitle}>Interstellar</Text>

                    <Text style={styles.downloadInfo}>1.4 GB • Descargado</Text>
                  </View>
                </View>

                <View style={styles.downloadCard}>
                  <Ionicons name="download" size={24} color="#E50914" />

                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.downloadTitle}>Dark Temporada 1</Text>

                    <Text style={styles.downloadInfo}>3.8 GB • Completa</Text>
                  </View>
                </View>

                <View style={styles.downloadCard}>
                  <Ionicons name="download" size={24} color="#E50914" />

                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.downloadTitle}>The Batman</Text>

                    <Text style={styles.downloadInfo}>
                      2.1 GB • Disponible sin conexión
                    </Text>
                  </View>
                </View>

                <Text style={styles.storageText}>
                  Almacenamiento usado: 7.3 GB de 32 GB
                </Text>
              </>
            )}

            {/* REPRODUCCIÓN */}
            {currentSection === "playback" && (
              <>
                <Text style={styles.modalTitle}>
                  Configuración de reproducción
                </Text>

                <View style={styles.playbackCard}>
                  <Text style={styles.settingLabel}>Calidad de video</Text>

                  <View style={styles.optionsRow}>
                    {["360p", "720p", "1080p", "4K"].map((quality) => (
                      <TouchableOpacity
                        key={quality}
                        style={[
                          styles.optionButton,
                          videoQuality === quality && styles.optionButtonActive,
                        ]}
                        onPress={() => setVideoQuality(quality)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            videoQuality === quality && styles.optionTextActive,
                          ]}
                        >
                          {quality}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.playbackCard}>
                  <Text style={styles.settingLabel}>
                    Velocidad de reproducción
                  </Text>

                  <View style={styles.optionsRow}>
                    {["0.5x", "1.0x", "1.5x", "2.0x", "4.0x"].map((speed) => (
                      <TouchableOpacity
                        key={speed}
                        style={[
                          styles.optionButton,
                          playbackSpeed === speed && styles.optionButtonActive,
                        ]}
                        onPress={() => setPlaybackSpeed(speed)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            playbackSpeed === speed && styles.optionTextActive,
                          ]}
                        >
                          {speed}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    Saltar intros automáticamente
                  </Text>

                  <Switch
                    value={autoplayEnabled}
                    onValueChange={setAutoplayEnabled}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>Subtítulos automáticos</Text>

                  <Switch
                    value={subtitlesEnabled}
                    onValueChange={setSubtitlesEnabled}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>Reducir uso de datos</Text>

                  <Switch
                    value={dataSaverEnabled}
                    onValueChange={setDataSaverEnabled}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
    backgroundColor: "#E50914",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  profileName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    textTransform: "capitalize",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#121212",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },

  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "flex-start",
  },

  notificationTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },

  notificationText: {
    color: "#b3b3b3",
    fontSize: 14,
    lineHeight: 20,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },

  switchText: {
    color: "#fff",
    fontSize: 15,
  },

  closeButton: {
    backgroundColor: "#E50914",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 10,
  },

  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  downloadCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  downloadTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  downloadInfo: {
    color: "#888",
    marginTop: 4,
  },

  storageText: {
    color: "#888",
    marginTop: 10,
    fontSize: 13,
  },

  playbackCard: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  settingLabel: {
    color: "#888",
    fontSize: 13,
    marginBottom: 5,
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  optionButton: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },

  optionButtonActive: {
    backgroundColor: "#E50914",
  },

  optionText: {
    color: "#aaa",
    fontWeight: "bold",
  },

  optionTextActive: {
    color: "#fff",
  },
});
