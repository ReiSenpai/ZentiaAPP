import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_KEY = "92b418e837b833be308bbfb1fb2aca1e";

// --- DATOS PARA LOS FILTROS ---
const CATEGORIAS = [
  "Película",
  "Serie",
  "Anime",
  "Novela",
  "Favoritos",
  "Próximamente",
];
const GENEROS = [
  { label: "Todos", value: "" },
  { label: "Acción", value: "28" },
  { label: "Romance", value: "10749" },
  { label: "Comedia", value: "35" },
  { label: "Terror", value: "27" },
  { label: "Ciencia Ficción", value: "878" },
];
const AUDIENCIAS = ["Todas", "Niños", "Jóvenes", "Adultos"];
const ANIOS = ["Todos", "2024", "2023", "2022", "2021", "2020", "2010s"];

export default function CatalogScreen() {
  const router = useRouter();

  // --- ESTADOS PRINCIPALES ---
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- ESTADOS DEL SNIPPET DE FILTROS ---
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    categoria: "Película",
    genero: "",
    audiencia: "Todas",
    anio: "Todos",
  });

  // --- EFECTO PARA DISPARAR LA BÚSQUEDA / FILTRADO ---
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delay = setTimeout(() => {
        searchMovies(searchQuery);
      }, 500);
      return () => clearTimeout(delay);
    } else {
      loadContentByFilters();
    }
  }, [filtros, searchQuery]);

  // --- LÓGICA DE CONSTRUCCIÓN DE API (Múltiples parámetros) ---
  const loadContentByFilters = async () => {
    setLoading(true);
    setError(null);

    try {
      if (filtros.categoria === "Favoritos") {
        await loadFavorites();
        return;
      }

      let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES`;
      let extraParams = "";

      // 1. Filtro por Categoría
      if (filtros.categoria === "Serie") {
        baseUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES`;
      } else if (filtros.categoria === "Anime") {
        baseUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=16&with_original_language=ja`;
      } else if (filtros.categoria === "Novela") {
        baseUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=10766`;
      } else if (filtros.categoria === "Próximamente") {
        baseUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=es-ES`;
      }

      // 2. Filtro por Género (Solo si no es Próximamente)
      if (filtros.genero !== "" && filtros.categoria !== "Próximamente") {
        extraParams += `&with_genres=${filtros.genero}`;
      }

      // 3. Filtro por Audiencia
      if (filtros.audiencia === "Niños")
        extraParams += `&certification_country=US&certification.lte=PG`;
      if (filtros.audiencia === "Adultos") extraParams += `&include_adult=true`;

      // 4. Filtro por Año
      if (filtros.anio !== "Todos" && filtros.categoria !== "Próximamente") {
        if (filtros.anio === "2010s") {
          extraParams += `&primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31`;
        } else {
          const yearParam =
            filtros.categoria === "Película"
              ? "primary_release_year"
              : "first_air_date_year";
          extraParams += `&${yearParam}=${filtros.anio}`;
        }
      }

      const finalUrl = baseUrl + extraParams;
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error("Error en la API");

      const result = await response.json();
      setData(result.results || []);
    } catch {
      setError("No se pudieron cargar los títulos.");
    } finally {
      setLoading(false);
    }
  };

  // --- BÚSQUEDA MANUAL ---
  const searchMovies = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`,
      );
      const result = await response.json();
      setData(result.results || []);
    } catch {
      setError("Error en la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // --- PERSISTENCIA LOCAL (Favoritos) ---
  const loadFavorites = async () => {
    try {
      const favoritesStr = await AsyncStorage.getItem("@favorites");
      if (favoritesStr) {
        const favoriteIds = JSON.parse(favoritesStr);
        if (favoriteIds.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const favPromises = favoriteIds.map((id: string) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`,
          ).then((res) => res.json()),
        );

        const favResults = await Promise.all(favPromises);
        setData(favResults.filter((movie) => movie.id));
      } else {
        setData([]);
      }
    } catch {
      setError("No se pudieron cargar los favoritos.");
    } finally {
      setLoading(false);
    }
  };

  // Actualizador de estado de filtros
  const updateFilter = (key: string, value: string) => {
    setSearchQuery(""); // Limpiar búsqueda al filtrar
    setFiltros((prev) => ({ ...prev, [key]: value }));
  };

  // Renderizado de tarjeta
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

  // Componente reutilizable para los botones de filtros (Snippets)
  const FilterRow = ({ title, options, filterKey, isObj = false }: any) => (
    <View style={styles.filterRow}>
      <Text style={styles.filterRowTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {options.map((opt: any, index: number) => {
          const label = isObj ? opt.label : opt;
          const value = isObj ? opt.value : opt;
          const isActive = filtros[filterKey as keyof typeof filtros] === value;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => updateFilter(filterKey, value)}
            >
              <Text
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Buscador Superior y Botón de Filtro */}
      <View style={styles.headerRow}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Botón que despliega el Snippet de filtros */}
        <TouchableOpacity
          style={[
            styles.toggleFilterBtn,
            showFilters && styles.toggleFilterBtnActive,
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="options"
            size={24}
            color={showFilters ? "#fff" : "#E50914"}
          />
        </TouchableOpacity>
      </View>

      {/* SNIPPET DE FILTROS DESPLEGABLE */}
      {showFilters && (
        <View style={styles.snippetContainer}>
          <FilterRow
            title="Categoría"
            options={CATEGORIAS}
            filterKey="categoria"
          />
          {/* Ocultamos Género, Audiencia y Año si la categoría es Favoritos o Próximamente porque no aplican */}
          {!["Favoritos", "Próximamente"].includes(filtros.categoria) && (
            <>
              <FilterRow
                title="Género"
                options={GENEROS}
                filterKey="genero"
                isObj={true}
              />
              <FilterRow
                title="Audiencia"
                options={AUDIENCIAS}
                filterKey="audiencia"
              />
              <FilterRow title="Año" options={ANIOS} filterKey="anio" />
            </>
          )}
        </View>
      )}

      <Text style={styles.title}>
        {searchQuery.length > 0 ? "Resultados de búsqueda" : "Catálogo"}
      </Text>

      {/* Grid de Contenido */}
      {loading ? (
        <View style={styles.centerScreen}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : error ? (
        <View style={styles.centerScreen}>
          <Text style={{ color: "#fff" }}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadContentByFilters()}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "#E50914" }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.centerScreen}>
          <Text style={{ color: "#888" }}>No se encontraron resultados.</Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    color: "#fff",
    height: 45,
    flex: 1,
    fontSize: 16,
  },
  toggleFilterBtn: {
    backgroundColor: "#1a1a1a",
    height: 45,
    width: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleFilterBtnActive: {
    backgroundColor: "#E50914",
  },

  // --- ESTILOS DEL SNIPPET ---
  snippetContainer: {
    backgroundColor: "#111",
    marginHorizontal: 15,
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  filterRow: {
    marginBottom: 10,
  },
  filterRowTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  filterScroll: {
    paddingHorizontal: 10,
  },
  filterChip: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#333",
  },
  filterChipActive: {
    backgroundColor: "#E50914",
    borderColor: "#E50914",
  },
  filterText: {
    color: "#ccc",
    fontSize: 13,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
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
