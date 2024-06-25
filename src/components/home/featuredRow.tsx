import { ScrollView, Text, View } from "react-native";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import ProductList from "../product/productList";

interface FeaturedRowProps {
  id: any;
  title: string;
  description: string;
}

export default function FeaturedRow({
  id,
  title,
  description,
}: FeaturedRowProps) {
  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg">{title}</Text>
        <ArrowRightIcon color="#00CCBB" />
      </View>

      <Text className="text-xs text-gray-500 px-4">{description}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{}}
        className="pt-4 overflow-visible"
      >
        {/* ProductList */}
        <ProductList />
      </ScrollView>
    </View>
  );
}
