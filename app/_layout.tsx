import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Grupo de Autenticación */}
      <Stack.Screen name="(auth)" />
      {/* Grupo principal de la app */}
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}
