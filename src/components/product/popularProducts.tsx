import { useEffect, useState } from "react";
import { baseUrl } from "../../api/url.contants";
import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import axios from "axios";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import ProductCard from "./productCard";
import { useNavigation } from "@react-navigation/native";

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchdata() {
      const response = await axios.get<Category[]>(baseUrl + "Category");
      setCategories(response.data);

      const productsResponse = await axios.get<Product[]>(
        baseUrl + "Cart/getpopularProducts"
      );
      setProducts(productsResponse.data);
      console.log(products);

      //   setIsLoaded(true);
    }
    fetchdata();
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      className=" overflow-visible"
    >
      {products.length != 0 ? (
        products.map((product) => {
          if (!product) {
            return null;
          }
          return <ProductCard key={product.productId} product={product} />;
        })
      ) : (
        <View>
          <Text className="text-gray-500 m-auto text-xs mt-20">
            There are no popular products 👉👈😅
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
