import { useEffect, useState } from "react";
import Spinner from "../../../components/common/Spinner";
import { CargoEnum, Cart } from "../../../models/Cart";
import { baseUrl } from "../../../api/url.contants";
import axios from "axios";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function CargoManagement() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState<Cart[]>([]);

  const navigate = useNavigation();

  const CargoClassNameCreator = (Roles: string) => {
    let containerStyle = {};
    if (Roles.includes(CargoEnum.Getting_ready)) {
      containerStyle = { backgroundColor: "#C8E6C9", color: "#2E7D32" };
    } else if (Roles.includes(CargoEnum.Send_by_cargo)) {
      containerStyle = { backgroundColor: "#BBDEFB", color: "#0D47A1" };
    } else if (Roles.includes(CargoEnum.Set_out)) {
      containerStyle = { backgroundColor: "#B3E5FC", color: "#0277BD" };
    } else if (Roles.includes(CargoEnum.Distribution)) {
      containerStyle = { backgroundColor: "#FFE082", color: "#FFB300" };
    } else if (Roles.includes(CargoEnum.Delivered)) {
      containerStyle = { backgroundColor: "#C8E6C9", color: "#2E7D32" };
    }
    return containerStyle;
  };
  const navigateToUpdateCargoStatus = (cartId: number | null) => {
    navigate.navigate("UpdateCargoStatus", {
      cartId: cartId,
    });
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get<Cart[]>(baseUrl + "Cart/allOrders");
      setCart(response.data);
      setIsLoaded(true);
    }
    fetchData();
  }, [cart]);

  if (!isLoaded) return <Spinner />;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Cargo Management</Text>

      {cart.map((item, index) => (
        <View key={index} style={styles.productContainer}>
          <View style={styles.productInfo}>
            <Image
              source={{ uri: item.product.image }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.productPrize}>${item.product.price}</Text>
              <Text style={styles.productText}>
                Stock: {item.product.stock}
              </Text>
            </View>
            <View
              style={[
                styles.cargoStatus,
                CargoClassNameCreator(item.cargoType),
              ]}
            >
              <Text>{item.cargoType}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                onPress={() => navigateToUpdateCargoStatus(item.cartId)}
              >
                <FontAwesome
                  name="edit"
                  size={26}
                  color="#007bff"
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
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
  pageTitle: {
    color: "#1E90FF",
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 2,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productText: {
    fontSize: 16,
    color: "#555",
  },
  productPrize: {
    fontSize: 16,
    marginBottom: 5,
    color: "#CD5C5C",
  },
  cargoStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginLeft: 22,
  },
});
