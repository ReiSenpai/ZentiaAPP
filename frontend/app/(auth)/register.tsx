import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Convertimos a función asíncrona para usar AsyncStorage
  const handleRegister = async () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    let isValid = true;

    if (name.trim() === "") {
      setNameError("El nombre es obligatorio.");
      isValid = false;
    }

    if (email.trim() === "") {
      setEmailError("El correo es obligatorio.");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Ingresa un correo electrónico válido.");
      isValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("La contraseña es obligatoria.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Mínimo 6 caracteres.");
      isValid = false;
    }

    if (isValid) {
      try {
        // Guardamos los datos del usuario como un objeto JSON
        const userData = { name, email, password };
        await AsyncStorage.setItem("@user_data", JSON.stringify(userData));

        router.replace("/");
      } catch (error) {
        console.log("Error al guardar datos de registro");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.logo}>ZENTIA</Text>
        <Text style={styles.subtitle}>Crea tu cuenta</Text>

        <TextInput
          style={[styles.input, nameError ? styles.inputError : null]}
          placeholder="Nombre completo"
          placeholderTextColor="#8c8c8c"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError("");
          }}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          placeholderTextColor="#8c8c8c"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Contraseña"
          placeholderTextColor="#8c8c8c"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError("");
          }}
          secureTextEntry
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.signupLink}>Inicia Sesión.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  formContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  logo: {
    color: "#E50914",
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 2,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    height: 60,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: { borderWidth: 1, borderColor: "#ff3333" },
  errorText: {
    color: "#ff3333",
    fontSize: 13,
    marginBottom: 15,
    marginTop: -5,
    paddingLeft: 5,
  },
  button: {
    backgroundColor: "#E50914",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  signupContainer: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
  },
  signupText: { color: "#737373", fontSize: 16 },
  signupLink: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
