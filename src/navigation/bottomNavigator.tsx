// BottomNavigator.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { UserIcon } from "react-native-heroicons/outline";
import useAuth from "../hooks/useAuth.hook";

const BottomNavigator = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();

  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  const navigateToCart = () => {
    navigation.navigate("CartPage");
  };

  const navigateToRegister = () => {
    if (isAuthenticated) {
      console.log(user?.roles);
      if (user?.roles && user.roles.includes("ADMIN")) {
        navigation.navigate("WelcomeAdmin");
      } else {
        navigation.navigate("Welcome");
      }
    } else {
      navigation.navigate("Login");
    }
  };

  const navigateToV = () => {
    navigation.navigate("Catalog");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={navigateToCart}>
        <Ionicons name="cart" size={26} color="#00CCBB" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToHome}>
        <MaterialCommunityIcons
          name="home-circle-outline"
          size={40}
          color="#00CCBB"
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToRegister}>
        <FontAwesome5 name="user-alt" size={24} color="#00CCBB" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToV}>
        <FontAwesome5 name="search" size={24} color="#00CCBB" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 1,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  button: {
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#00CCBB",
  },
});

export default BottomNavigator;
