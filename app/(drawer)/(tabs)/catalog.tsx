import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 1. Interfaz para los items del catálogo
interface MovieItem {
  id: string;
  title: string;
  imageUrl: string;
}

// Datos de prueba
const DATA: MovieItem[] = [
  {
    id: "1",
    title: "Peli 1",
    imageUrl:
      "https://www.themoviedb.org/t/p/w1280/o4SM2hP63vMaPuAox6UuwVybHo4.jpg",
  },
  {
    id: "2",
    title: "Peli 2",
    imageUrl:
      "https://www.themoviedb.org/t/p/w1280/o4SM2hP63vMaPuAox6UuwVybHo4.jpg",
  },
  {
    id: "3",
    title: "Peli 3",
    imageUrl:
      "https://www.themoviedb.org/t/p/w1280/o4SM2hP63vMaPuAox6UuwVybHo4.jpg",
  },
  {
    id: "4",
    title: "Peli 4",
    imageUrl:
      "https://www.themoviedb.org/t/p/w1280/o4SM2hP63vMaPuAox6UuwVybHo4.jpg",
  },
  {
    id: "5",
    title: "Peli 5",
    imageUrl:
      "https://www.themoviedb.org/t/p/w1280/o4SM2hP63vMaPuAox6UuwVybHo4.jpg",
  },
  {
    id: "6",
    title: "Peli 6",
    imageUrl:
      "https://www.themoviedb.org/t/p/w1280/o4SM2hP63vMaPuAox6UuwVybHo4.jpg",
  },
];

export default function CatalogScreen() {
  const renderItem = ({ item }: { item: MovieItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Buscador Superior */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar series, películas..."
          placeholderTextColor="#888"
        />
      </View>

      <Text style={styles.title}>Todos los títulos</Text>

      {/* Grid de Contenido */}
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3} // 3 columnas como en las apps de streaming
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
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
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 15,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: "flex-start",
  },
  card: {
    flex: 1 / 3, // Ocupa un tercio de la pantalla
    aspectRatio: 2 / 3, // Proporción de poster vertical
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
