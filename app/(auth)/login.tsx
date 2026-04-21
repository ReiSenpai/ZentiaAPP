import { Href, router } from "expo-router"; // <-- CORREGIDO AQUÍ
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Si ya tienes el index.tsx en (drawer)/(tabs), esto funcionará:
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.logo}>ZENTIA</Text>

        <TextInput
          style={styles.input}
          placeholder="Introduce su Email o número de teléfono"
          placeholderTextColor="#8c8c8c"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#8c8c8c"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpText}>¿Necesitas ayuda?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿Nuevo en Zentia? </Text>
          <TouchableOpacity onPress={() => router.push("/register" as Href)}>
            <Text style={styles.signupLink}>Suscríbete ahora.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ... (tus estilos abajo están perfectos)

// ESTO ES LO QUE TE FALTABA PARA QUITAR EL ROJO
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    color: "#c904fb",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    height: 60,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2501d6",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  helpButton: {
    marginTop: 20,
    alignItems: "center",
  },
  helpText: {
    color: "#b3b3b3",
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
  },
  signupText: {
    color: "#737373",
    fontSize: 16,
  },
  signupLink: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
