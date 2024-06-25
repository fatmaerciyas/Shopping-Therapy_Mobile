import React, { useState } from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";
import { Category } from "../../models/Category";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [isActive, setIsActive] = useState(0);

  return (
    <View className="flex justify-center items-center mr-2">
      <TouchableOpacity
        onPress={() => setIsActive(category.categoryId)}
        className="p-1 rounded-full pt-4 "
      >
        <Image
          style={{ width: 70, height: 70, borderRadius: 50 }}
          source={{ uri: category.image }}
        />

        <Text
          className={`text-sm text-center bottom-1 left-1 text-gray-600 font-bold ${isActive ? "font-semibold text-gray-300" : ""}`}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
