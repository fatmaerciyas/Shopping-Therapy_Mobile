import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import {
  AdjustmentsHorizontalIcon,
  UserIcon,
} from "react-native-heroicons/outline";

import Categories from "../../components/category/categories";
import FeaturedRow from "../../components/home/featuredRow";
import * as Icon from "react-native-feather";
import Footer from "../../components/home/footer";
import Slide from "../../components/home/slide";
import ProductList from "../../components/product/productList";
import BottomNavigator from "../../navigation/bottomNavigator";
import SearchBar from "../../components/home/searchBar";
import FeaturedRowPopular from "../../components/home/faturedRowPopular";

export default function Home() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="pt-5  ">
      {/* Header */}
      <View className="flex-row pb-3 items-center mx-2 space-x-2">
        <Image
          source={{ uri: "https://links.papareact.com/wru" }}
          className="h-7 w-7 bg-gray-300 p-4 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-bold text-lg">OneStopShop</Text>
        </View>
        <UserIcon size={30} color="#00CCBB" />
      </View>
      {/* End of Header */}

      {/* Body */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 8,
        }}
        className="bg-gray-100 pb-4"
      >
        <Slide />

        {/* Categories */}
        <Categories />
        {/* End of Categories */}

        {/* Featured Row */}
        <FeaturedRow
          id="123"
          title="Last Products"
          description="You can see our latest added products here"
        />

        <FeaturedRowPopular
          id="123"
          title="Popular Products"
          description="Check out our most purchased products"
        />

        {/* Footer */}
        <View className="flex-row items-center space-x-2 m-4"></View>
      </ScrollView>
    </SafeAreaView>
  );
}
