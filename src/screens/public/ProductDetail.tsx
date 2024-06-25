import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Product } from "../../models/Product";
import { baseUrl } from "../../api/url.contants";
import * as Icon from "react-native-feather";
import agent from "../../api/agent";
import Spinner from "../../components/common/Spinner";
import useAuth from "../../hooks/useAuth.hook";

const ProductDetail = () => {
  const route = useRoute();
  const { productId } = route.params;
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation();

  const navigateToMyOrders = () => {
    if (isAuthenticated) {
      navigation.navigate("");
    }
    navigation.navigate("Order");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(
          `${baseUrl}Product?id=${productId}`
        );
        console.log(product?.brand);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const addCartItemAsync = ({ productId, quantity = 1 }) => {
    try {
      if (isAuthenticated) {
        agent.Cart.createCart(productId, quantity);

        Alert.alert("The product has been added to your cart ✅");
      } else {
        navigation.navigate("Login");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("The product couldn't add to your cart ❌");
    }
  };

  if (loading || !product) {
    return <Spinner />; // or render a loading indicator
  }

  return (
    <View>
      <ScrollView>
        <View className="relative">
          <Image className="w-full h-80" source={{ uri: product.image }} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-14 left-4 bg-gray-50 p-2 rounded-full shadow"
          >
            <Icon.ArrowLeft strokeWidth={3} color="gray" />
          </TouchableOpacity>
        </View>
        <View
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
          className=" bg-slate-200 -mt-12 pt-4 shadow"
        >
          <View className="px-5 items-center bg-white rounded-full">
            <Text className="text-xl font-bold">{product.name}</Text>
            <View className="flex-row space-x-2 my-1">
              <View className="flex-row items-center space-x-1 ">
                <Image source={{ uri: product.image }} className="" />
                <Text className="text-xs">
                  <Text className="text-green-700">{product.brand}</Text>
                  <Text className="text-gray-700">{product.category}</Text>
                </Text>
              </View>
              <View className="flex-row items-center space-x-1">
                <Text className="text-gray-700 text-xs">
                  Stock: {product.stock}
                </Text>
              </View>
            </View>
            <View className="bg-white pt-8 pb-36">
              <Text className="text-gray-700">{product.description}</Text>
              <View className="flex-row justify-between ">
                <Text className="text-gray-500 text-lg font-bold line-through">
                  ${product.price + 48}
                </Text>
                <Text
                  className="text-gray-700 text-lg font-bold "
                  style={{
                    color: "#00CCBB",
                  }}
                >
                  ${product.price}
                </Text>
              </View>
              <View className="pt-16">
                <Pressable
                  onPress={() => {
                    navigateToMyOrders;
                    addCartItemAsync({
                      productId: product.productId!,
                      quantity: 1,
                    });
                  }}
                >
                  <Text className=" py-2 px-8 bg-blue-500 hover:bg-blue-700 text-white font-bold border border-blue-700 rounded">
                    Add to cart
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  addToCartButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "blue",
    borderRadius: 5,
    elevation: 8,
  },
  addToCartButtonInner: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  newTag: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "orange",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  newTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
  },
  oldPriceText: {
    fontSize: 18,
    color: "red",
    textDecorationLine: "line-through",
  },
});

export default ProductDetail;
