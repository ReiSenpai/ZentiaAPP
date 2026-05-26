import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  let baseHeight = 40;
  if (screenHeight < 700) {
    baseHeight = 50;
  } else if (screenHeight > 900) {
    baseHeight = 70;
  }

  const finalTabHeight =
    baseHeight +
    (insets.bottom > 0 ? insets.bottom : Platform.OS === "android" ? 10 : 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#8c8c8c",
        tabBarStyle: {
          backgroundColor: "#fffefe",
          borderTopColor: "#000000",
          height: finalTabHeight,
          paddingBottom:
            insets.bottom > 0
              ? insets.bottom
              : Platform.OS === "android"
                ? 10
                : 5,
          paddingTop: Platform.OS === "android" ? 0 : 5,
        },
      }}
    >
      {/* 1. Botón INICIO */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Botón CATÁLOGO */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 3. NUEVO: Botón FAVORITOS */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* 4. Botón AJUSTES */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
