import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Example icon library
import useAuth from "../../../hooks/useAuth.hook";
import { useNavigation } from "@react-navigation/native";

interface MenuItem {
  name: string;
  icon: string;
  color: string;
  url: string;
}

const WelcomeAdmin: React.FC = () => {
  const { user, logout } = useAuth(); // Assuming you have a logout function in useAuth hook
  const navigation = useNavigation();

  const menuItems: MenuItem[] = [
    {
      name: "Product Management",
      icon: "shopping-cart",
      color: "#FF6347",
      url: "ProductManagement",
    },
    {
      name: "Category Management",
      icon: "list-alt",
      color: "#1E90FF",
      url: "CategoryManagement",
    },
    {
      name: "Order Management",
      icon: "list-alt",
      color: "#EE76FF",
      url: "Order",
    },
    {
      name: "Cargo Management",
      icon: "truck",
      color: "#32CD32",
      url: "CargoManagement",
    },
    {
      name: "Message Management",
      icon: "envelope",
      color: "#FFD700",
      url: "AllMessages",
    },
    {
      name: "User Management",
      icon: "user",
      color: "#87CEEB",
      url: "UserManagement",
    },
  ];

  return (
    <ScrollView>
      <Text style={styles.welcomeText}>Welcome, admin {user?.userName}!</Text>
      <View style={styles.container}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.url as never)}
          >
            <Icon name={item.icon} size={30} color="white" />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.logOut, { backgroundColor: "#FF99CC" }]}
        onPress={logout} // Call the logout function here
      >
        <Text style={styles.logOutText}>Log out ➡️</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 12,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
  },
  menuItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 5,
  },
  logOut: {
    width: 90,
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 5,
    alignSelf: "center", // Center the logout button horizontally
  },
  menuText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  logOutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default WelcomeAdmin;
