import { useEffect, useState } from "react";
import { Product } from "../../../models/Product";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import { useNavigation } from "@react-navigation/native";
import { Alert, ScrollView, Text, View, StyleSheet } from "react-native";
import Spinner from "../../../components/common/Spinner";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigation();

  useEffect(() => {
    async function fetchdata() {
      const productsResponse = await axios.get<Product[]>(baseUrl + "Product");
      setProducts(productsResponse.data);

      setIsLoaded(true);
    }
    fetchdata();
  }, [products]);

  const handleDelete = async (id) => {
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
              const response = await axios.delete(baseUrl + "Product/" + id);

              if (response.status >= 200 && response.status < 300) {
                console.log("Product deleted successfully");
                Alert.alert("Deleted product");
                setIsLoaded(true);
              } else {
                console.error(
                  `Error deleting product. Status: ${response.status}, ${response.statusText}`
                );
                Alert.alert("Error", "Failed to delete product");
              }
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const productsResponse = await axios.delete<Product[]>(
  //       baseUrl + "Product/" + id
  //     );

  //     // baseUrl + "Product/" + id
  //     console.log(productsResponse.data);

  //     setIsLoaded(true);

  //     Alert.alert("Deleted product");
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // };

  const navigateToAddProduct = (productId: number | null) => {
    navigate.navigate("AddProduct", {
      productId: productId,
    });
  };

  if (!isLoaded) return <Spinner />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text className=" text-teal-500 m-auto pb-4 font-bold text-lg">
        Product Management
      </Text>
      <TouchableOpacity
        className="mb-5 p-1  bg-teal-500 rounded-md"
        onPress={() => navigateToAddProduct(null)}
      >
        <Text className="text-white text-lg font-bold m-auto">Add Product</Text>
      </TouchableOpacity>
      {products.map((product) => (
        <TouchableOpacity
          key={product.productId}
          onPress={() => navigateToAddProduct(product.productId)}
        >
          <View style={styles.productContainer}>
            <View style={styles.productInfo}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productText}>Stock: {product.stock}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => navigateToAddProduct(product.productId)}
                >
                  <FontAwesome
                    name="edit"
                    size={26}
                    color="#007bff"
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(product.productId)}
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
          </View>
        </TouchableOpacity>
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
    padding: 10,
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
    fontSize: 18,
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
