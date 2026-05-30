import { Stack } from "expo-router";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Grupo de Autenticación */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* Grupo principal de la app */}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}
