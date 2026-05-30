import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_KEY = "92b418e837b833be308bbfb1fb2aca1e";

export default function FavoritesScreen() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useFocusEffect ejecuta esta función CADA VEZ que el usuario entra a esta pestaña.
  // Así, si agrega un favorito en otra pantalla, se actualiza al instante aquí.
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const favoritesStr = await AsyncStorage.getItem("@favorites");

      if (favoritesStr) {
        const favoriteIds = JSON.parse(favoritesStr);

        if (favoriteIds.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        // Hacemos un fetch por cada ID guardada en favoritos
        const favPromises = favoriteIds.map((id: string) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`,
          ).then((res) => {
            // Si falla como película, intentamos como serie de TV (TV Show)
            if (res.status === 404) {
              return fetch(
                `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=es-ES`,
              ).then((r) => r.json());
            }
            return res.json();
          }),
        );

        const favResults = await Promise.all(favPromises);
        setData(favResults.filter((item) => item.id)); // Filtramos errores
      } else {
        setData([]);
      }
    } catch (err) {
      setError("No se pudieron cargar tus favoritos.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "https://via.placeholder.com/500x750.png?text=Sin+Imagen";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push(`/details/${item.id}` as any)}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Lista</Text>

      {loading ? (
        <View style={styles.centerScreen}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : error ? (
        <View style={styles.centerScreen}>
          <Text style={{ color: "#fff" }}>{error}</Text>
          <TouchableOpacity onPress={loadFavorites} style={{ marginTop: 10 }}>
            <Text style={{ color: "#E50914" }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.centerScreen}>
          <Ionicons
            name="heart-dislike-outline"
            size={60}
            color="#333"
            style={{ marginBottom: 10 }}
          />
          <Text style={{ color: "#888", fontSize: 16 }}>
            Tu lista está vacía.
          </Text>
          <Text style={{ color: "#555", fontSize: 14, marginTop: 5 }}>
            Agrega películas desde el catálogo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
  },
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  row: {
    justifyContent: "flex-start",
  },
  card: {
    flex: 1 / 3,
    aspectRatio: 2 / 3,
    margin: 5,
    backgroundColor: "#111",
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
