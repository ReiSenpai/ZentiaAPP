import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // RECUPERAR DATOS AL ABRIR LA PANTALLA
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
      }
    } catch {
      setMessage("Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  };

  // ACTUALIZAR DATOS
  const handleSave = async () => {
    if (!name || !email || !password) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }
    setSaving(true);
    setMessage("");

    try {
      const updatedData = { name, email, password };
      await AsyncStorage.setItem("@user_data", JSON.stringify(updatedData));
      setMessage("¡Perfil actualizado con éxito!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error al guardar cambios.");
    } finally {
      setSaving(false);
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
      {/* Header */}
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
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#333" />
        </View>

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

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#8c8c8c"
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#8c8c8c"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#8c8c8c"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  backButton: { padding: 5 },
  content: { padding: 20 },
  avatarContainer: { alignItems: "center", marginBottom: 30 },
  label: { color: "#a3a3a3", fontSize: 14, marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#E50914",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  message: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
  messageSuccess: { color: "#28a745" },
  messageError: { color: "#ff3333" },
});
