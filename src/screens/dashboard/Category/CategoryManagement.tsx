import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import { useNavigation } from "@react-navigation/native";
import { Alert, ScrollView, Text, View, StyleSheet } from "react-native";
import Spinner from "../../../components/common/Spinner";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Category } from "../../../models/Category";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigation();

  useEffect(() => {
    async function fetchdata() {
      const categoriesResponse = await axios.get<Category[]>(
        baseUrl + "Category"
      );
      setCategories(categoriesResponse.data);

      setIsLoaded(true);
    }
    fetchdata();
  }, [categories]);

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
              const response = await axios.post(
                baseUrl + "Category/deleteItem?id=" + id
              );

              if (response.status >= 200 && response.status < 300) {
                console.log("Category deleted successfully");
                Alert.alert("Deleted category");
                setIsLoaded(true);
              } else {
                console.error(
                  `Error deleting category. Status: ${response.status}, ${response.statusText}`
                );
                Alert.alert("Error", "Failed to delete category");
              }
            } catch (error) {
              console.error("Error deleting category:", error);
              Alert.alert("Error", "Failed to delete category");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToAddCategory = (categoryId: number | null) => {
    navigate.navigate("AddCategory", {
      categoryId: categoryId,
    });
  };

  if (!isLoaded) return <Spinner />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text className=" text-teal-500 m-auto pb-4 font-bold text-lg">
        Category Management
      </Text>
      <TouchableOpacity
        className="mb-5 p-1  bg-teal-500 rounded-md"
        onPress={() => navigateToAddCategory(null)}
      >
        <Text className="text-white text-lg font-bold m-auto">
          Add Category
        </Text>
      </TouchableOpacity>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.categoryId}
          onPress={() => handleDelete(category.categoryId)}
        >
          <View style={styles.productContainer}>
            <View style={styles.productInfo}>
              <Image
                source={{ uri: category.image }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{category.name}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  onPress={() => navigateToAddCategory(category.categoryId)}
                >
                  <FontAwesome
                    name="edit"
                    size={26}
                    color="#007bff"
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(category.categoryId)}
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
