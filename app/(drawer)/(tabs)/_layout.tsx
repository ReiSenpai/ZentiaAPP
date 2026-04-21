import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Con esto Ocultaremos el header nativo porque ya hicimos uno transparente
        tabBarShowLabel: false, // ¡Aquí hacemos que SOLO se vea el icono!
        tabBarActiveTintColor: "#E50914", // Rojo Zentia cuando está seleccionado
        tabBarInactiveTintColor: "#8c8c8c", // Gris cuando no está seleccionado
        tabBarStyle: {
          backgroundColor: "#fffefe", // Gris súper oscuro para la barra
          borderTopColor: "#000000", // Borde superior negro
          height: 60, // Un poco más alta para que sea cómoda
          paddingBottom: 10, // Espacio para el borde inferior del iPhone
        },
      }}
    >
      {/* 1. Botón INICIO */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={26} color={color} />
          ),
        }}
      />

      {/* 2. Botón CATÁLOGO */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={26} color={color} />
          ),
        }}
      />

      {/* 3. Botón AJUSTES */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
