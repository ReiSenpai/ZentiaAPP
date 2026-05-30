import { Stack } from "expo-router";
import React from "react";

export default function Authlayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000000" }, //Fondo negro
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
