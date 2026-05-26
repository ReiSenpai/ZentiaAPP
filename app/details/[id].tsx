import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DetailsScreen() {
  // AQUI RECIBIMOS EL TIPO (movie o tv)
  const { id, type } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSeries, setIsSeries] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      let response;

      // LOGICA INTELIGENTE: Busca directo en Serie o Pelicula segun el 'type'
      if (type === "tv") {
        response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=92b418e837b833be308bbfb1fb2aca1e&language=es-ES`,
        );
        setIsSeries(true);
      } else if (type === "movie") {
        response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=92b418e837b833be308bbfb1fb2aca1e&language=es-ES`,
        );
        setIsSeries(false);
      } else {
        // Respaldo por si no llega el type
        response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=92b418e837b833be308bbfb1fb2aca1e&language=es-ES`,
        );
        if (response.status === 404) {
          response = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=92b418e837b833be308bbfb1fb2aca1e&language=es-ES`,
          );
          setIsSeries(true);
        }
      }

      const result = await response.json();
      setData(result);
    } catch {
      console.error("Error al cargar detalles");
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  const checkFavorite = useCallback(async () => {
    try {
      const favoritesStr = await AsyncStorage.getItem("@favorites");
      if (favoritesStr) {
        const parsed = JSON.parse(favoritesStr);
        setIsFavorite(parsed.includes(String(id))); // Aseguramos que sea string
      }
    } catch {
      console.log("Error al leer favoritos");
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
    checkFavorite();
  }, [fetchDetails, checkFavorite]);

  const toggleFavorite = async () => {
    try {
      const favoritesStr = await AsyncStorage.getItem("@favorites");
      let favorites = favoritesStr ? JSON.parse(favoritesStr) : [];

      if (isFavorite) {
        favorites = favorites.filter((favId: string) => favId !== String(id));
      } else {
        favorites.push(String(id));
      }

      await AsyncStorage.setItem("@favorites", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch {
      console.log("Error al guardar favorito");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  const imageUrl =
    data?.backdrop_path || data?.poster_path
      ? `https://image.tmdb.org/t/p/w1280${data?.backdrop_path || data?.poster_path}`
      : "https://via.placeholder.com/1280x720.png?text=Sin+Imagen";

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.backdrop} />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{data?.title || data?.name}</Text>

        <Text style={styles.meta}>
          {data?.release_date || data?.first_air_date} •{" "}
          {isSeries
            ? `${data?.number_of_seasons} Temporadas`
            : `${data?.runtime || 0} min`}
        </Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => router.push(`/player/${id}` as any)}
          >
            <Ionicons name="play" size={24} color="black" />
            <Text style={styles.playText}>Reproducir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.favButton} onPress={toggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.overview}>
          {data?.overview ||
            "No hay descripción disponible para este título en español."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", backgroundColor: "#000" },
  backdrop: { width: "100%", height: 250 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "white", marginBottom: 5 },
  meta: { color: "gray", fontSize: 14, marginBottom: 20 },
  buttonsRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  playButton: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    padding: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  playText: { fontSize: 16, fontWeight: "bold", marginLeft: 5 },
  favButton: { padding: 10 },
  overview: { color: "white", fontSize: 15, lineHeight: 22 },
});
