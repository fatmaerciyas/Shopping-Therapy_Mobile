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

interface AddCategoryProps {
  categoryId: number | null; // Corrected prop name
}

const AddCategory: FC<AddCategoryProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { categoryId } = route.params;
  const [imageURL, setImageURL] = useState<string>("");

  const [category, setCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
    image: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (categoryId == null) {
          console.log("Add Category");
        } else {
          const categoryResponse = await axios.get<Category>(
            `${baseUrl}Category/${categoryId}`
          );
          setCategory(categoryResponse.data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProduct();
  }, [categoryId]);

  const [isFocus, setIsFocus] = useState(false);

  const changeHandler = (name: string, value: string) => {
    setCategory({
      ...category,
      [name]: value,
    });
  };

  const handleSaveBtnClick = () => {
    if (
      category.name === "" ||
      category.description === "" ||
      category?.image === ""
    ) {
      Alert.alert("Please Enter All Values");
      return;
    }

    const data: Partial<Category> = {
      name: category.name,
      description: category.description,
      image: category.image,
    };
    const dataUpdate: Partial<Category> = {
      categoryId: categoryId,
      name: category.name,
      description: category.description,
      image: category.image,
    };

    if (categoryId === null) {
      agent.Category.createCategory(data)
        .then(() => {
          Alert.alert("Success", "Product added successfully");
          navigation.navigate("CategoryManagement"); // Navigate to ProductList after adding
        })
        .catch((error) => {
          console.error("Error creating product:", error);
          Alert.alert("Error", "Failed to add product");
        });
    } else {
      agent.Category.updateCategory(dataUpdate)
        .then(() => {
          Alert.alert("Success", "Product updated successfully");
          navigation.navigate("CategoryManagement"); // Navigate to ProductList after updating
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          Alert.alert("Error", "Failed to update product");
        });
    }
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

  if (!isLoaded) return <Spinner />;

  return (
    <>
      {categoryId === null ? (
        <ScrollView className="bg-gray-200" style={styles.container}>
          <Text className=" text-teal-500 m-auto font-bold text-lg">
            Add Category
          </Text>
          <Text className="m-1">Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Category Name"
            value={category.name}
            onChangeText={(value) => changeHandler("name", value)}
          />
          <Text className="m-1">Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={category.description}
            onChangeText={(value) => changeHandler("description", value)}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image</Text>
            <Button title="Choose Image" onPress={handleImagePicker} />
            {imageURL ? (
              <Image source={{ uri: imageURL }} style={styles.image} />
            ) : null}
          </View>
          <TouchableOpacity
            className="mb-16 mt-5 p-2  bg-teal-600 rounded-md"
            onPress={handleSaveBtnClick}
          >
            <Text className="text-white text-lg font-bold m-auto">
              Add Category
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView className="bg-gray-200" style={styles.container}>
          <Text className=" text-teal-500 m-auto font-bold text-lg">
            Edit Category
          </Text>
          <Text className="m-1">Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={category.name}
            onChangeText={(value) => changeHandler("name", value)}
          />
          <Text className="m-1">Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={category.description}
            onChangeText={(value) => changeHandler("description", value)}
          />
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: category.image }}
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

          <TouchableOpacity
            className="mb-16 mt-5 p-2  bg-teal-600 rounded-md"
            onPress={handleSaveBtnClick}
          >
            <Text className="text-white text-lg font-bold m-auto">
              Edit Category
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

export default AddCategory;

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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
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
