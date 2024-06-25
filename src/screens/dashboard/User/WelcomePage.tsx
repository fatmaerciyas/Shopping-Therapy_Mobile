import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { Basket } from "../../../models/Basket";
import { Cart } from "../../../models/Cart";
import { Product } from "../../../models/Product";
import useAuth from "../../../hooks/useAuth.hook";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import Spinner from "../../../components/common/Spinner";
import { useNavigation } from "@react-navigation/native";

const WelcomePage = () => {
  const [basket, setBasket] = useState<Basket[]>([]);
  const [cart, setCart] = useState<Cart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const navigateToUpdateProfile = (id: number | null | string) => {
    navigation.navigate("UpdateProfilePage", {
      id: id,
    });
  };
  const navigateToMyCargos = () => {
    navigation.navigate("MyCargos");
  };

  const navigateToMyOrders = () => {
    navigation.navigate("Order");
  };

  const navigateToMyCart = () => {
    navigation.navigate("CartPage");
  };

  const navigateToCatalog = () => {
    navigation.navigate("Catalog");
  };

  const navigateToMyMessage = () => {
    navigation.navigate("InboxMessage");
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}Cart/carts`)
      .then((response) => setBasket(response.data));

    axios
      .get(`${baseUrl}Cart/orders?username=${user?.userName}`)
      .then((response) => setCart(response.data));

    setLoading(false);

    axios
      .get<Product[]>(baseUrl + "Product")
      .then((response) => setProducts(response.data))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <ScrollView style={styles.container} className="bg-gray-100">
      <View style={styles.centerContainer}>
        <Text style={styles.welcomeText}>Welcome, {user?.userName}!</Text>
      </View>
      <View className="flex-row items-center bg-white p-4 rounded-2xl shadow mb-3 mx-2">
        <View className="flex flex-1 space-y-4">
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 2,
            }}
          >
            <Pressable
              onPress={() => navigateToMyCart(user?.id)}
              className="bg-red-400"
              style={{
                padding: 10,
                borderRadius: 25,
                flex: 1,
              }}
            >
              <Text style={{ textAlign: "center" }}>My cart 🛒</Text>
            </Pressable>

            <Pressable
              onPress={() => navigateToUpdateProfile(user?.id)}
              className="bg-purple-400"
              style={{
                padding: 10,
                borderRadius: 25,
                flex: 1,
              }}
            >
              <Text style={{ textAlign: "center" }}>My Account 😊</Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 12,
            }}
          >
            <Pressable
              onPress={navigateToMyOrders}
              className="bg-emerald-400"
              style={{
                padding: 10,
                borderRadius: 25,
                flex: 1,
              }}
            >
              <Text style={{ textAlign: "center" }}>Buy Again ✨</Text>
            </Pressable>

            <Pressable
              onPress={() => navigateToMyCargos()}
              className="bg-yellow-400"
              style={{
                padding: 10,
                borderRadius: 25,
                flex: 1,
              }}
            >
              <Text style={{ textAlign: "center" }}>My Cargos 🚚</Text>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 12,
            }}
          >
            <Pressable
              onPress={navigateToMyMessage}
              className=" bg-orange-400"
              style={{
                padding: 10,
                borderRadius: 25,
                flex: 1,
              }}
            >
              <Text style={{ textAlign: "center" }}> Messages 📩</Text>
            </Pressable>

            <Pressable
              onPress={logout}
              className="bg-blue-300"
              style={{
                padding: 10,
                borderRadius: 25,
                flex: 1,
              }}
            >
              <Text style={{ textAlign: "center" }}>Logout➡️</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Last Orders 🎁</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading ? (
          <Spinner />
        ) : cart.length > 0 ? (
          cart.map((item, index) => (
            <Pressable
              key={`${item.product.productId}-${index}`}
              className="shadow"
              style={styles.cartItem}
            >
              {item.product && (
                <View>
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.productImage}
                  />
                </View>
              )}
            </Pressable>
          ))
        ) : (
          <Text className="text-center p-12">No order found</Text>
        )}
      </ScrollView>

      <View style={styles.header}>
        <Text style={styles.headerText}>Your Cart ✨</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading ? (
          <Spinner />
        ) : basket.length > 0 ? (
          basket.map((item, index) => (
            <Pressable
              key={`${item.product.productId}-${index}`}
              className="shadow"
              style={styles.cartItem}
            >
              {item.product && (
                <View>
                  <Image
                    source={{ uri: item.product.image }}
                    style={styles.productImage}
                  />
                </View>
              )}
            </Pressable>
          ))
        ) : (
          <Text className="text-center p-12">
            No cart found please add some item 😊
          </Text>
        )}
      </ScrollView>
      <View>
        <TouchableOpacity
          className="rounded-full p-3"
          onPress={() => navigation.navigate("CartPage")}
        >
          <Text
            className={`text-white text-center rounded-2xl p-1 ${
              cart.length === 0 ? "bg-gray-400" : "bg-teal-600"
            } font-bold text-lg`}
          >
            Go back to shopping 🛒
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 30,
  },
  centerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    marginTop: 14,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
  },
  menuItem: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  menuText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartItem: {
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Add a white background to the cart item
  },
  productImage: {
    width: 80, // Adjust the width to fit your design
    height: 80, // Adjust the height to fit your design
    resizeMode: "contain",
    borderRadius: 10, // Adjust the border radius as needed
  },
});

export default WelcomePage;
