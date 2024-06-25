import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { CargoEnum, Cart } from "../../../models/Cart";
import { baseUrl } from "../../../api/url.contants";
import axios from "axios";
import Spinner from "../../../components/common/Spinner";
import useAuth from "../../../hooks/useAuth.hook";
import { useNavigation } from "@react-navigation/native";

export default function MyCargos() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState<Cart[]>([]);

  const CargoClassNameCreator = (Roles: string) => {
    let style = {};
    if (Roles.includes(CargoEnum.Getting_ready)) {
      style = styles.success;
    } else if (Roles.includes(CargoEnum.Send_by_cargo)) {
      style = styles.primary;
    } else if (Roles.includes(CargoEnum.Set_out)) {
      style = styles.info;
    } else if (Roles.includes(CargoEnum.Distribution)) {
      style = styles.warning;
    } else if (Roles.includes(CargoEnum.Delivered)) {
      style = styles.success;
    }
    return style;
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get<Cart[]>(baseUrl + "Cart/orders", {
        params: { userName: user?.userName },
      });
      setCart(response.data);
      setIsLoaded(true);
    }
    fetchData();
  }, [user?.userName]);

  if (!isLoaded) return <Spinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Where is My Order</Text>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Brand</Text>
          <Text style={styles.tableHeaderText}>Image</Text>
          <Text style={styles.tableHeaderText}>Stock</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
          <Text style={styles.tableHeaderText}>Cargo Status</Text>
        </View>
        {cart.map((item, index) => (
          <View
            key={`${item.product.productId}-${index}`}
            style={styles.tableRow}
          >
            <Text style={styles.tableCell}>{item.product.name}</Text>
            <Text style={styles.tableCell}>{item.product.brand}</Text>
            <Image style={styles.image} source={{ uri: item.product.image }} />
            <Text style={styles.tableCell}>{item.product.stock}</Text>
            <Text style={styles.tableCell}>{item.product.price}</Text>
            <View
              style={[styles.tableCell, CargoClassNameCreator(item.cargoType)]}
            >
              <Text>{item.cargoType}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4a90e2",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#d0d0d0",
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d0d0d0",
  },
  tableCell: {
    fontSize: 12,
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  success: {
    fontSize: 10,
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
  },
  primary: {
    fontSize: 10,
    backgroundColor: "#cce5ff",
    color: "#004085",
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 12,
    backgroundColor: "#d1ecf1",
    color: "#0c5460",
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
  },
  warning: {
    fontSize: 12,
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: 5,
    borderRadius: 10,
    textAlign: "center",
  },
});
