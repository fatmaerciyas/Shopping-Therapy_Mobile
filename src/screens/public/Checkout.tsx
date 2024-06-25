import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import * as Icon from "react-native-feather";
import { Cart } from "../../models/Cart";
import { baseUrl } from "../../api/url.contants";
import axios from "axios";
import Login from "./Login";
import useAuth from "../../hooks/useAuth.hook";
import agent from "../../api/agent";
import Spinner from "../../components/common/Spinner";

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Cart[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
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

  async function addOrder() {
    console.log(user?.userName);
    if (user?.userName) {
      agent.Basket.createBasket(user.userName);
    }
    navigation.navigate("CreditCardPage");
  }

  if (!isLoaded) return <Spinner />;

  return (
    <View className="bg-white flex-1">
      <View className="relative py-1 shadow-sm">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute z-10 rounded-full p-1 bg-teal-600 shadow top-5 left-2"
        >
          <Icon.ArrowLeft strokeWidth={3} stroke="white" />
        </TouchableOpacity>
        <View>
          <Text className="text-center font-bold text-xl">Your cart</Text>
          <Text className="text-center text-gray-500">aaa </Text>
        </View>
      </View>

      <View className="bg-teal-200 flex-row px-4 items-center">
        <Image
          source={require("../../assets/images/backgrounds/vector.jpg")}
          className="w-16 h-16 rounded-full"
        />
        <Text className="flex-1 pl-4">Deliver in 2-3 days</Text>
        <TouchableOpacity>
          <Text className="font-bold text-teal-600">Change</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 50,
        }}
        className="bg-white pt-5"
      >
        {cart.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: "gray",
              marginHorizontal: 10,
            }}
          >
            Your cart is empty. Please add items to your cart. 😊🛒
          </Text>
        ) : (
          cart.map((cartItem, index) => (
            <View
              key={index}
              className="flex-row items-center rounded-3xl space-x-3 py-2 px-4 bg-white mb-3 mx-2 shadow-md"
            >
              <Text className="font-bold text-teal-600">
                {cartItem.quantity}x
              </Text>
              <Image
                className="rounded-full h-14 w-14"
                source={{ uri: cartItem.product.image }}
              />
              <Text className="flex-1 font-bold text-gray-700">
                {cartItem.product.name}
              </Text>
              <Text className="font-semibold text-base">
                ${cartItem.product.price}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View className="p-4 px-8 rounded-t-3xl space-y-4 bg-teal-200">
        <View className="flex-row justify-between">
          <Text className="text-gray-700">Subtotal</Text>
          <Text className="text-gray-700">${subtotal}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700">Delivery Free</Text>
          <Text className="text-gray-700">$0</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700 font-extrabold">Order Total</Text>
          <Text className="text-gray-700 font-extrabold">${subtotal}</Text>
        </View>
        <View>
          <TouchableOpacity
            className="rounded-full p-3"
            onPress={addOrder}
            disabled={cart.length === 0} // Disable the button when cart is empty
          >
            <Text
              className={`text-white text-center rounded-2xl p-1 ${
                cart.length === 0 ? "bg-gray-400" : "bg-teal-600"
              } font-bold text-lg`}
            >
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
