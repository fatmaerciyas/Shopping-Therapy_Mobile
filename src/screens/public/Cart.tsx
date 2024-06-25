import { useCallback, useEffect, useState } from "react";
import { Cart } from "../../models/Cart";
import axios from "axios";
import { baseUrl } from "../../api/url.contants";
import agent from "../../api/agent";
import { useNavigation } from "@react-navigation/native";
import { View, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import * as Icon from "react-native-feather";
import Spinner from "../../components/common/Spinner";

interface CartModel {
  productId: number;
  quantity: number;
  product: {
    price: number; // Assuming price is a property of the product object
    // Other properties of the product object
  };
}

export default function CartPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState<Cart[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigation = useNavigation();

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    cart.forEach((cartItem) => {
      totalPrice += cartItem.product.price * cartItem.quantity;
    });

    return totalPrice;
  };

  useEffect(() => {
    async function fetchdata() {
      const response = await axios.get<Cart[]>(baseUrl + "Cart/carts");
      setCart(response.data);
      setSubtotal(calculateTotalPrice());

      setIsLoaded(true);
    }
    fetchdata();
  }, [cart, calculateTotalPrice]);

  async function deleteData(productId: number, { quantity = 1 }) {
    setIsLoaded(false);
    try {
      return agent.Cart.deleteCart(productId, quantity);
    } catch (err) {
      console.log(err);
    }
    setIsLoaded(true);
  }

  async function addData(productId: number, { quantity = 1 }) {
    try {
      return agent.Cart.createCart(productId, quantity);
    } catch (err) {
      console.log(err);
    }
  }

  const decrement = useCallback((cartItem: CartModel) => {
    if (cartItem.quantity > 0) {
      deleteData(cartItem.productId, cartItem.quantity);
      setSubtotal(cartItem.product.price * cartItem.quantity);
    }
  }, []);

  const increment = useCallback((cartItem: CartModel) => {
    addData(cartItem.productId, cartItem.quantity);
    setSubtotal(cartItem.product.price * cartItem.quantity);
  }, []);

  const handleClick = (url: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    navigation.navigate(url as never);
  };

  if (!isLoaded) return <Spinner />;

  return (
    <ScrollView style={{ backgroundColor: "#F8F8F8" }}>
      <View className="mb-4" style={{ backgroundColor: "#F8F8F8" }}>
        <Image
          source={require("../../assets/images/backgrounds/home1.jpg")}
          style={{ width: "100%", height: 200 }}
          resizeMode="cover"
        />
        <View style={{ position: "absolute", top: 40, left: 20 }}>
          <View style={{ marginTop: 14 }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold" }}
              className="text-white"
            >
              Basket
            </Text>
          </View>
          <View style={{ marginTop: 3 }}>
            <Text
              style={{
                color: "white",
                textTransform: "uppercase",
                fontSize: 13,
                fontWeight: "bold",
              }}
            >
              Buy whatever you want :)
            </Text>
          </View>
        </View>
      </View>
      <View className="-mt-12 rounded-full">
        {cart.length === 0 ? ( // Check if cart is empty
          <Text className="text-gray-600 text-md mt-32 mx-16 text-center">
            Your cart is empty. Please add items to your cart 😊🛒
          </Text>
        ) : (
          cart.map((cartItem, index) => (
            <View
              key={index}
              className="flex-row items-center bg-white p-3 rounded-3xl shadow mb-3 mx-2"
            >
              <Image
                className="rounded-3xl"
                style={{ height: 100, width: 100 }}
                source={{ uri: cartItem.product.image }}
              />
              <View className="flex flex-1 space-y-3">
                <View className="pl-3">
                  <Text className="text-xl text-gray-600">
                    {cartItem.product.name}
                  </Text>
                  <Text className="text-gray-700">
                    {cartItem.product.description}
                  </Text>
                </View>
                <View className="flex-row justify-between pl-3 items-center">
                  <Text className="text-gray-700 text-lg font-bold">
                    ${cartItem.product.price}
                  </Text>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => decrement(cartItem)}
                      className="p-1 rounded-full"
                      style={{ backgroundColor: "#00CCBB" }}
                    >
                      <Icon.Minus
                        strokeWidth={1}
                        height={20}
                        width={20}
                        stroke={"white"}
                      />
                    </TouchableOpacity>
                    <Text className="px-3">{cartItem.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => increment(cartItem)}
                      className="p-1 rounded-full"
                      style={{ backgroundColor: "#00CCBB" }}
                    >
                      <Icon.Plus
                        strokeWidth={1}
                        height={20}
                        width={20}
                        stroke={"white"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
      {cart.length > 0 && (
        <View className="flex-col justify-between p-4">
          <View className="flex-1">
            <View className="border-b border-gray-300">
              <View className="flex-row justify-between p-2">
                <Text className="font-semibold text-lg ">Subtotal :</Text>
                <Text className="text-gray-700 text-lg">$ {subtotal}</Text>
              </View>
              <View className="flex-row justify-between p-2 border-t border-gray-300">
                <Text className="font-semibold text-lg ">Cargo :</Text>
                <Text className="text-gray-700 text-lg">$ 29.99</Text>
              </View>
              <View className="flex-row justify-between p-2 border-t border-gray-300">
                <Text className="font-semibold text-lg">Total :</Text>
                <Text className="font-semibold text-lg">$ {subtotal + 29}</Text>
              </View>
            </View>
          </View>

          <View className="flex-2">
            <TouchableOpacity
              onPress={() => navigation.navigate("Checkout")}
              className="bg-teal-500 rounded p-2"
            >
              <Text className="text-white text-center">Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
  //   if (!isLoaded) return <Spinner />;
}
