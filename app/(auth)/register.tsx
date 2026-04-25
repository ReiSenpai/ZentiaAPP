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

  // ESTADOS NUEVOS: Para errores
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = () => {
    // Resetear errores antes de comprobar
    setNameError("");
    setEmailError("");
    setPasswordError("");
    let isValid = true;

    // Validar Nombre
    if (name.trim() === "") {
      setNameError("El nombre es obligatorio.");
      isValid = false;
    }

    // Validar Correo
    if (email.trim() === "") {
      setEmailError("El correo es obligatorio.");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Ingresa un correo electrónico válido.");
      isValid = false;
    }

    // Validar Contraseña
    if (password.trim() === "") {
      setPasswordError("La contraseña es obligatoria.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Mínimo 6 caracteres.");
      isValid = false;
    }

    // Si todo está bien, registramos y entramos a la app
    if (isValid) {
      router.replace("/");
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

        {/* INPUT NOMBRE */}
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

        {/* INPUT EMAIL */}
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

        {/* INPUT CONTRASEÑA */}
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
  // ESTILOS DE ERROR IGUALES AL LOGIN
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
