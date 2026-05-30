import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router } from "expo-router";
import React, { useState } from "react";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ESTADOS NUEVOS
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
    let isValid = true;

    if (email.trim() === "") {
      setEmailError("El correo es obligatorio.");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Por favor, ingresa un correo válido.");
      isValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("La contraseña es obligatoria.");
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true);
      try {
        // RECUPERAMOS LOS DATOS DE ASYNCSTORAGE
        const userDataStr = await AsyncStorage.getItem("@user_data");

        if (userDataStr) {
          const userData = JSON.parse(userDataStr);

          // VERIFICAMOS CREDENCIALES
          if (userData.email === email && userData.password === password) {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
              router.replace("/");
            }, 800);
          } else {
            setIsLoading(false);
            setPasswordError("Correo o contraseña incorrectos.");
          }
        } else {
          setIsLoading(false);
          setEmailError("No existe una cuenta con este correo.");
        }
      } catch (error) {
        setIsLoading(false);
        setPasswordError("Ocurrió un error al iniciar sesión.");
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

        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Introduce su Email o número de teléfono"
          placeholderTextColor="#8c8c8c"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError("");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading && !isSuccess} // Bloquea el input si está cargando
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
          editable={!isLoading && !isSuccess} // Bloquea el input si está cargando
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        {/* BOTÓN CON ANIMACIÓN DINÁMICA */}
        <TouchableOpacity
          style={[
            styles.button,
            isSuccess ? styles.buttonSuccess : null, // Cambia a verde si es éxito
          ]}
          onPress={handleLogin}
          disabled={isLoading || isSuccess} // Desactiva el botón mientras carga para que no hagan doble clic
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" /> // El circulito de carga
          ) : isSuccess ? (
            <Text style={styles.buttonText}>¡Bienvenido!</Text> // Texto de éxito
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text> // Texto normal
          )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  formContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
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
    backgroundColor: "#2501d6",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  // Agregado el color verde para cuando el login es correcto
  buttonSuccess: {
    backgroundColor: "#28a745",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  helpButton: { marginTop: 20, alignItems: "center" },
  helpText: { color: "#b3b3b3", fontSize: 14 },
  signupContainer: {
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
  },
  signupText: { color: "#737373", fontSize: 16 },
  signupLink: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});
