import { FC, useEffect, useState } from "react";
import { baseUrl } from "../../../api/url.contants";
import { Cart } from "../../../models/Cart";
import axios from "axios";
import {
  Alert,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Spinner from "../../../components/common/Spinner";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface UpdateCargoParams {
  cartId: number | null;
}

const UpdateCargoStatusPage: FC<UpdateCargoParams> = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { cartId } = route.params;

  const [isLoaded, setIsLoaded] = useState(false);
  const [cargoType, setCargoType] = useState<string[]>([]);
  const [cart, setCart] = useState<Cart[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  const [selectedCargoType, setSelectedCargoType] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const CargoTypeResponse = await axios.get<string[]>(
          baseUrl + "Cart/getCargoTypes"
        );
        setCargoType(CargoTypeResponse.data);

        const Response = await axios.get<Cart[]>(
          baseUrl + `Cart/getById?id=${cartId}`
        );
        if (Array.isArray(Response.data)) {
          setCart(Response.data);
          if (Response.data.length > 0) {
            setSelectedCargoType(Response.data[0].cargoType);
          }
        } else {
          setCart([]);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, [cartId]);

  const changeHandler = (name: string, value: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.productId === cartId ? { ...item, [name]: value } : item
      );
      return updatedCart;
    });
  };

  const handleUpdateCargoType = async (item: Cart) => {
    const cargoTypeId =
      selectedCargoType === "Send_by_cargo"
        ? 1
        : selectedCargoType === "Set_out"
          ? 2
          : selectedCargoType === "Distribution"
            ? 3
            : selectedCargoType === "Delivered"
              ? 4
              : 0;

    try {
      await axios.post<Cart[]>(
        baseUrl +
          `Cart/updateCargoType?productId=${item.productId}&CargoTypeId=${cargoTypeId}&basketId=${item.basketId}`
      );

      Alert.alert(`Cargo updated to ${selectedCargoType} ✅`);
    } catch (error) {
      console.error("Error updating cargo type: ", error);
    }
  };

  if (!isLoaded) return <Spinner />;

  return (
    <ScrollView className="bg-gray-200" style={styles.container}>
      <Text className="text-teal-500 m-auto font-bold text-lg">Edit Cargo</Text>
      {cart.map((item) => (
        <View key={item.productId} style={styles.itemContainer}>
          <Text className="m-1">Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={item.product.name}
            onChangeText={(value) => changeHandler("name", value)}
          />
          <Text className="m-1">Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Description"
            value={item.product.description}
            onChangeText={(value) => changeHandler("description", value)}
          />
          <Text className="m-1">Image Url</Text>
          <Image
            className="rounded-md h-32 w-32 m-auto"
            source={{ uri: item.product.image }}
          />
          <Text className="m-1">Category</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
              placeholder={
                selectedCargoType ? selectedCargoType : "Select a category"
              }
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              data={cargoType.map((type) => ({ label: type, value: type }))}
              labelField="label"
              valueField="value"
              maxHeight={300}
              value={selectedCargoType}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setSelectedCargoType(item.value);
                setIsFocus(false);
                changeHandler("cargoType", item.value);
              }}
            />
          </View>
          <Text className="m-1">Brand</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Brand"
            value={item.product.brand}
            onChangeText={(value) => changeHandler("brand", value)}
          />
          <Text className="m-1">Stock</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Stock"
            value={item.product.stock.toString()}
            onChangeText={(value) => changeHandler("stock", value)}
          />
          <Text className="m-1">Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Product Price"
            value={item.product.price.toString()}
            onChangeText={(value) => changeHandler("price", value)}
          />
          <TouchableOpacity
            className="mb-16 mt-5 p-2 bg-teal-600 rounded-md"
            onPress={() => handleUpdateCargoType(item)}
          >
            <Text className="text-white text-lg font-bold m-auto">
              Edit Product
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default UpdateCargoStatusPage;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 12,
  },
  itemContainer: {
    marginBottom: 20,
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
  dropdownContainer: {
    zIndex: 1000,
  },
  dropdown: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
