import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [movies, setMovies] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [action, setAction] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=92b418e837b833be308bbfb1fb2aca1e&language=es-ES",
      );

      if (!response.ok) throw new Error("Error al obtener los datos");

      const data = await response.json();

      if (data.results) {
        setMovies(data.results);
        setTrending(data.results.slice(0, 10));
        setAction(data.results.slice(10, 20));
      }
    } catch {
      setError("No se pudieron cargar las películas. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.movieCard}
      // AQUI ENVIAMOS EL TYPE=MOVIE
      onPress={() => router.push(`/details/${item.id}?type=movie` as any)}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.movieImage}
        contentFit="cover"
        transition={300}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerScreen]}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Cargando Zentia...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerScreen]}>
        <Text style={{ color: "white", marginBottom: 15 }}>{error}</Text>
        <TouchableOpacity style={styles.playButton} onPress={fetchMovies}>
          <Text style={styles.playText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const heroMovie = movies.length > 0 ? movies[0] : null;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView
        style={[styles.topNav, { top: insets.top > 0 ? insets.top : 40 }]}
      >
        <Text style={styles.logoText}>ZENTIA</Text>
        <View style={styles.topNavIcons}>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => router.push("/catalog")}
          >
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
              }}
              style={styles.profileAvatar}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView bounces={false}>
        <ImageBackground
          source={{
            uri: heroMovie
              ? `https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path}`
              : "https://www.themoviedb.org/t/p/w1280/aabwWZWx6z1aYP4PX2ADvbDKktd.jpg",
          }}
          style={styles.heroBanner}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)", "#000000"]}
            style={styles.gradient}
          />

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => router.push(`/player/${heroMovie?.id}` as any)}
            >
              <Ionicons name="play" size={20} color="black" />
              <Text style={styles.playText}>Reproducir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.listButton}
              onPress={() => router.push("/favorites")}
            >
              <AntDesign name="plus" size={20} color="white" />
              <Text style={styles.listText}>Mi lista</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Películas en tendencia</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={trending}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.flatListPadding}
          />

          <Text style={styles.sectionTitle}>Agregados recientemente</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[...movies].reverse()}
            keyExtractor={(item) => item.id.toString() + "-recent"}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.flatListPadding}
          />

          <Text style={styles.sectionTitle}>Acción y Aventura</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={action}
            keyExtractor={(item) => item.id.toString() + "-action"}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.flatListPadding}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centerScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  topNav: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  logoText: {
    color: "#E50914",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  topNavIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  heroBanner: {
    width: "100%",
    height: 550,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
  },
  heroButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 40,
    zIndex: 2,
  },
  playButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  playText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  listButton: {
    backgroundColor: "rgba(51, 51, 51, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  listText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  content: {
    marginTop: -30,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
    paddingLeft: 15,
  },
  flatListPadding: {
    paddingLeft: 15,
    paddingRight: 5,
  },
  movieCard: {
    marginRight: 10,
  },
  movieImage: {
    width: 110,
    height: 160,
    borderRadius: 4,
    backgroundColor: "#222",
  },
});
