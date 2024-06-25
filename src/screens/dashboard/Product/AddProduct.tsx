import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Spinner from "../../../components/common/Spinner";
import { Category } from "../../../models/Category";
import { baseUrl } from "../../../api/url.contants";
import axios from "axios";
import agent from "../../../api/agent";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Product } from "../../../models/Product";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";

interface AddProductProps {
  productId: number | null; // Corrected prop name
}

const AddProduct: FC<AddProductProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [imageURL, setImageURL] = useState<string>("");

  const { productId } = route.params;

  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    image: "",
    brand: "",
    stock: 100,
    price: 0,
    quantity: 1,
    category: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Category | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId == null) {
          console.log("Add Product");
        } else {
          const productResponse = await axios.get<Product>(
            `${baseUrl}Product?id=${productId}`
          );
          setProduct(productResponse.data);

          if (productResponse.data.categoryId) {
            const categoryResponse = await axios.get<Category>(
              `${baseUrl}Category/${productResponse.data.categoryId}`
            );
            setSelectedValue(categoryResponse.data);
          }
        }
        const categoriesResponse = await axios.get<Category[]>(
          `${baseUrl}Category`
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProduct();
  }, [productId]);

  const [isFocus, setIsFocus] = useState(false);

  const changeHandler = (name: string, value: string) => {
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageURI = result.assets[0].uri;
      setImageURL(imageURI);
      changeHandler("image", imageURI);
    }
  };

  const handleSaveBtnClick = () => {
    if (
      product.name === "" ||
      product.brand === "" ||
      selectedValue?.name === ""
    ) {
      Alert.alert("Please Enter All Values");
      return;
    }

    const data: Partial<Product> = {
      name: product.name,
      description: product.description,
      image: product.image,
      brand: product.brand,
      stock: Number(product.stock), // Convert stock to string
      price: Number(product.price),
      quantity: 1,
      category: selectedValue?.name,
    };

    if (productId === null) {
      agent.Product.createProduct(data)
        .then(() => {
          Alert.alert("Success", "Product added successfully");
          navigation.navigate("ProductManagement"); // Navigate to ProductList after adding
        })
        .catch((error) => {
          console.error("Error creating product:", error);
          Alert.alert("Error", "Failed to add product");
        });
    } else {
      agent.Product.updateProduct(data, productId)
        .then(() => {
          Alert.alert("Success", "Product updated successfully");
          navigation.navigate("ProductManagement"); // Navigate to ProductList after updating
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          Alert.alert("Error", "Failed to update product");
        });
    }
  };

  if (!isLoaded) return <Spinner />;

  return (
    <>
      {productId === null ? (
        <ScrollView className="bg-gray-200" style={styles.container}>
          <Text className=" text-teal-500 m-auto font-bold text-lg">
            Add Product
          </Text>
          <Text className="m-1">Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={product.name}
            onChangeText={(value) => changeHandler("name", value)}
          />
          <Text className="m-1">Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={product.description}
            onChangeText={(value) => changeHandler("description", value)}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image</Text>
            <Button title="Choose Image" onPress={handleImagePicker} />
            {imageURL ? (
              <Image source={{ uri: imageURL }} style={styles.image} />
            ) : null}
          </View>
          <Text className="m-1">Category</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholder={
              selectedValue?.name ? selectedValue?.name : "Select a category"
            } // Set initial placeholder text
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={categories}
            labelField="name" // Add this prop
            valueField="categoryId" // Add this prop
            maxHeight={300}
            value={selectedValue?.name} // Display selected category name
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setSelectedValue(item);
              setIsFocus(false);
              changeHandler("category", item?.name);
            }}
          />
          <Text className="m-1">Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="Brand"
            value={product.brand}
            onChangeText={(value) => changeHandler("brand", value)}
          />
          <Text className="m-1">Stock</Text>
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={product.stock?.toString()}
            onChangeText={(value) => changeHandler("stock", value)}
          />
          <Text className="m-1">Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={product.price?.toString()}
            onChangeText={(value) => changeHandler("price", value)}
          />
          <TouchableOpacity
            className="mb-16 mt-5 p-2  bg-teal-600 rounded-md"
            onPress={handleSaveBtnClick}
          >
            <Text className="text-white text-lg font-bold m-auto">
              Add Product
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView className="bg-gray-200" style={styles.container}>
          <Text className=" text-teal-500 m-auto font-bold text-lg">
            Edit Product
          </Text>
          <Text className="m-1">Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={product.name}
            onChangeText={(value) => changeHandler("name", value)}
          />
          <Text className="m-1">Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={product.description}
            onChangeText={(value) => changeHandler("description", value)}
          />
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image</Text>
            <Button title="Choose Image" onPress={handleImagePicker} />
            {imageURL ? (
              <Image source={{ uri: imageURL }} style={styles.image} />
            ) : null}
          </View>
          <Text className="m-1">Category</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholder={
              selectedValue?.name ? selectedValue?.name : "Select a category"
            } // Set initial placeholder text
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={categories}
            labelField="name" // Add this prop
            valueField="categoryId" // Add this prop
            maxHeight={300}
            value={selectedValue?.name} // Display selected category name
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setSelectedValue(item);
              setIsFocus(false);
              changeHandler("category", item?.name);
            }}
          />
          <Text className="m-1">Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="Brand"
            value={product.brand}
            onChangeText={(value) => changeHandler("brand", value)}
          />
          <Text className="m-1">Stock</Text>
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={product.stock?.toString()}
            onChangeText={(value) => changeHandler("stock", value)}
          />
          <Text className="m-1">Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={product.price?.toString()}
            onChangeText={(value) => changeHandler("price", value)}
          />
          <TouchableOpacity
            className="mb-16 mt-5 p-2  bg-teal-600 rounded-md"
            onPress={handleSaveBtnClick}
          >
            <Text className="text-white text-lg font-bold m-auto">
              Edit Product
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  imageContainer: {
    width: "100%",
    height: 200, // Set the height as needed
    marginBottom: 10,
  },

  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  image: {
    flex: 1,
    borderRadius: 10,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  dropdown: {
    flex: 1,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50, // Adjust the height as needed
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: "white",
    color: "black",
    zIndex: 999, // Set a high zIndex to ensure visibility
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
    // Adjust the icon style as needed, such as margin or positioning
  },
});
