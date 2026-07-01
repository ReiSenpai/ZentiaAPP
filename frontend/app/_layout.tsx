import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Mantenido para retrocompatibilidad
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Permite que salga el cartel flotante
    shouldShowList: true, // Permite que se quede en el historial de notificaciones
  }),
});
export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn(
            "[LOG] Permiso de notificaciones denegado por el usuario.",
          );
          return;
        }
        console.log("[LOG] Permisos de notificación concedidos correctamente.");
      } catch (error) {
        //Control de Errores
        console.error(
          "[ERROR] Fallo al solicitar permisos de notificación:",
          error,
        );
      }
    };

    requestNotificationPermissions();
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Grupo de Autenticación */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* Grupo principal de la app */}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}
