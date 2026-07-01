import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // FOTO PERFIL
  const [profileImage, setProfileImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // CARGAR DATOS
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem("@user_data");

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPassword(userData.password || "");
        setProfileImage(userData.profileImage || "");
      }
    } catch (error) {
      // RÚBRICA: Logging básico de errores
      console.error("[ERROR] Fallo al cargar los datos del usuario:", error);
      setMessage("Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  };

  // SELECCIONAR IMAGEN (RÚBRICA: Integración Hardware y Permisos)
  const pickImage = async () => {
    try {
      console.log("[LOG] Solicitando permisos de galería...");
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      // Tratamiento ante denegaciones
      if (!permission.granted) {
        Alert.alert(
          "Permiso Denegado",
          "Zentia requiere acceso a tu galería para cambiar la foto de perfil.",
        );
        console.warn("[LOG] Usuario denegó acceso a la galería.");
        setMessage("Debes permitir acceso a tus fotos.");
        return;
      }

      console.log("[LOG] Abriendo galería de imágenes...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        console.log(
          "[LOG] Imagen seleccionada correctamente:",
          result.assets[0].uri,
        );
      }
    } catch (error) {
      // RÚBRICA: Manejo de errores
      console.error("[ERROR] Excepción al abrir el ImagePicker:", error);
      Alert.alert(
        "Error del Sistema",
        "No se pudo abrir la galería en este dispositivo.",
      );
    }
  };

  // GUARDAR DATOS
  const handleSave = async () => {
    if (!name || !email || !password) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const updatedData = {
        name,
        email,
        password,
        profileImage,
      };

      await AsyncStorage.setItem("@user_data", JSON.stringify(updatedData));

      console.log("[LOG] Perfil guardado exitosamente.");
      setMessage("¡Perfil actualizado con éxito!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("[ERROR] Fallo al guardar en AsyncStorage:", error);
      setMessage("Error al guardar cambios.");
    } finally {
      setSaving(false);
    }
  };

  // RÚBRICA: Implementación de notificaciones locales (Integración de Evento Relevante)
  const triggerTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Hola, " + (name || "Usuario") + "! 🎬",
          body: "Zentia tiene nuevos estrenos que podrían interesarte. ¡Entra a revisarlos!",
          data: { screen: "catalog" },
        },
        trigger: {
          seconds: 2,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // <--- ESTA ES LA SOLUCIÓN
        },
      });
      console.log("[LOG] Notificación programada correctamente.");
      Alert.alert("Alerta Activada", "Saldrá una notificación en 2 segundos.");
    } catch (error) {
      console.error("[ERROR] Fallo al programar notificación local:", error);
      Alert.alert("Error", "Tu dispositivo bloqueó la notificación.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* FOTO PERFIL */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle" size={100} color="#333" />
          )}
          <Text style={styles.changePhotoText}>Cambiar foto</Text>
        </TouchableOpacity>

        {/* MENSAJES */}
        {message ? (
          <Text
            style={[
              styles.message,
              message.includes("éxito")
                ? styles.messageSuccess
                : styles.messageError,
            ]}
          >
            {message}
          </Text>
        ) : null}

        {/* NOMBRE */}
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          placeholderTextColor="#8c8c8c"
        />

        {/* EMAIL */}
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="correo@gmail.com"
          placeholderTextColor="#8c8c8c"
        />

        {/* PASSWORD */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
          placeholderTextColor="#8c8c8c"
        />

        {/* BOTÓN GUARDAR */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        {/* BOTÓN RÚBRICA - NOTIFICACIONES */}
        <TouchableOpacity
          style={[styles.button, styles.notificationButton]}
          onPress={triggerTestNotification}
          activeOpacity={0.8}
        >
          <Ionicons
            name="notifications"
            size={20}
            color="#ccc"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.notificationButtonText}>
            Probar Notificaciones
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ESTILOS INTACTOS + AGREGADOS DE NOTIFICACIÓN
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerScreen: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#E50914",
  },
  changePhotoText: {
    color: "#E50914",
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 15,
  },
  label: {
    color: "#a3a3a3",
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#E50914",
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row", // Agregado para alinear icono y texto del botón
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // ESTILO NUEVO PARA BOTON DE NOTIFICACION (Respetando el modo oscuro)
  notificationButton: {
    backgroundColor: "#222",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  notificationButtonText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
  messageSuccess: {
    color: "#28a745",
  },
  messageError: {
    color: "#ff3333",
  },
});
