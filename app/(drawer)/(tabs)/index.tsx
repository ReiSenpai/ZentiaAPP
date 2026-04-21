import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//Datos de prueba temporal
const MOVIES = [
  {
    id: "1",
    uri: "https://www.themoviedb.org/t/p/w1280/o4SM2hP63vMaPuAox6UuwVybHo4.jpg",
  },
  {
    id: "2",
    uri: "https://www.themoviedb.org/t/p/w1280/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    id: "3",
    uri: "https://www.themoviedb.org/t/p/w1280/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
  },
  {
    id: "4",
    uri: "https://www.themoviedb.org/t/p/w1280/eJGWx219ZcEMVQJhAgMiqo8tYY.jpg",
  },
  {
    id: "5",
    uri: "https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnL5.jpg",
  },
];
export default function homeScreen() {
  //Componentes que se renderizaran cada poster individualmente
  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.movieCard}>
      <Image
        source={{ uri: item.uri }}
        style={styles.movieImage}
        contentFit="cover"
        transition={300}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/*BARRA SUPERIOR FLOTANTE (ESTILO NETFLIX)*/}
      <SafeAreaView style={styles.topNav}>
        <Text style={styles.logoText}>ZENTIA</Text>
        <View style={styles.topNavIcons}>
          <TouchableOpacity style={{ marginRight: 20 }}>
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
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
        {/*Parte 1. El hero banner principal */}
        <ImageBackground
          source={{
            uri: "https://www.themoviedb.org/t/p/w1280/aabwWZWx6z1aYP4PX2ADvbDKktd.jpg",
          }}
          style={styles.heroBanner}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)", "#000000"]}
            style={styles.gradient}
          />

          {/*Botones del banner - import de ICONS */}
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={20} color="black" />
              <Text style={styles.playText}>Reproducir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listButton}>
              <AntDesign name="plus" size={20} color="white" />
              <Text style={styles.listText}>Mi lista</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {/*Parte 2 -> Carrusel de categorias */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Tendencias de Zentia</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MOVIES}
            keyExtractor={(item) => item.id}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.flatListPadding}
          />

          <Text style={styles.sectionTitle}>Agregados recientement</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[...MOVIES].reverse()}
            keyExtractor={(item) => item.id}
            renderItem={renderMovieItem}
            contentContainerStyle={styles.flatListPadding}
          />
          <Text style={styles.sectionTitle}>Acción y Aventura</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MOVIES}
            keyExtractor={(item) => item.id + "copy"}
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

  //Los estilos de la barra superior
  topNav: {
    position: "absolute",
    top: 40, //Libre de ajustar es si el notch/camara interfiere
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10, //Esto es para mantener la barra por encima del banner
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
  // ESTILOS DEL BANNER
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
    gap: 15, // Espaciado entre botones
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
    gap: 5, // Espaciado entre el icono y el texto
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
    gap: 5, // Espaciado entre el icono y el texto
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
