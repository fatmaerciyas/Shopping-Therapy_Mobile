import { useEffect, useState } from "react";
import { Basket } from "../../../models/Basket";
import { Cart } from "../../../models/Cart";
import useAuth from "../../../hooks/useAuth.hook";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import { ScrollView, Text, View, StyleSheet, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Spinner from "../../../components/common/Spinner";
import { useNavigation } from "@react-navigation/native";

export default function Order() {
  const [basket, setBasket] = useState<Basket[]>([]);
  const [cart, setCart] = useState<{ [key: number]: Cart[] }>({});
  const [orders, setOrders] = useState<Cart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigation();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}Basket/getbyuser?username=${user?.userName}`)
      .then((response) => setBasket(response.data))
      .catch((error) => console.error("Error fetching basket:", error));

    axios
      .get(`${baseUrl}Cart/orders?username=${user?.userName}`)
      .then((response) => {
        const groupedCart: { [key: number]: Cart[] } = {};
        response.data.forEach((cartItem: Cart) => {
          if (groupedCart[cartItem.basketId]) {
            groupedCart[cartItem.basketId].push(cartItem);
          } else {
            groupedCart[cartItem.basketId] = [cartItem];
          }
        });
        setCart(groupedCart);
      })
      .catch((error) => console.error("Error fetching cart:", error))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (productId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await axios.delete(
                baseUrl + "Cart/deleteCart?cartId=" + productId
              );

              if (response.status >= 200 && response.status < 300) {
                Alert.alert("Ordered item deleted successfully✅");
                setLoading(false);
              } else {
                console.error(
                  `Error deleting order. Status: ${response.status}, ${response.statusText}`
                );
                Alert.alert("Error", "Failed to delete order❌");
              }
            } catch (error) {
              console.error("Error deleting order:", error);
              Alert.alert("Error", "Failed to delete order❌");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToOrderDetail = (productId: number | null) => {
    navigate.navigate("ProductDetail", {
      productId: productId,
    });
  };
  if (!loading) {
    <Spinner />;
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text className=" text-teal-500 m-auto pb-4 font-bold text-lg">
        My Orders
      </Text>
      {Object.keys(cart).map((basketId, i) => (
        <View key={basketId}>
          <Text className="font-bold text-teal-600 pl-4 p-1">
            My Order {i + 1}
          </Text>
          {cart[basketId].map((item) => (
            <TouchableOpacity
              key={item.cartId}
              onPress={() => navigateToOrderDetail(item.product.productId)}
            >
              <View className="flex-row items-center rounded-3xl space-x-3 py-2 px-4 bg-white mb-3 mx-2 shadow-md">
                <Text className="font-bold text-teal-600">
                  {item.quantity}x
                </Text>
                <Image
                  className="rounded-full h-14 w-14"
                  source={{ uri: item.product.image }}
                />
                <Text className="flex-1 font-bold text-gray-700">
                  {item.product.name}
                </Text>
                <Text className="font-semibold text-base">
                  ${item.product.price}
                </Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.productId)}
                  >
                    <FontAwesome
                      name="trash"
                      size={26}
                      color="#dc3545"
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 12,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    elevation: 2,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productText: {
    fontSize: 16,
    color: "#555",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginLeft: 22,
  },
});
