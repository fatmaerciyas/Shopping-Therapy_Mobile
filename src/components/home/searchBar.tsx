import { TextInput, TouchableOpacity, View } from "react-native";
import { AdjustmentsHorizontalIcon } from "react-native-heroicons/outline";
import * as Icon from "react-native-feather";
import { useState } from "react";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (text) => {
    setSearchInput(text);
  };

  const handleMicClick = () => {
    console.log("Giriş yapılan metin:", searchInput);
    // Burada consola giriş yapılan metni yazdırıyoruz
  };

  return (
    <View className="flex-row items-end space-x-2 pb-2 mx-2 mt-2">
      <View className="flex-row flex-1 items-center pb-1 gap-2 bg-white shadow rounded-full mx-1 px-2">
        <TouchableOpacity onPress={handleMicClick}>
          <Icon.Search height="18" width="18" stroke="gray" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search..."
          className="flex-1"
          onChangeText={handleInputChange}
          value={searchInput}
        />
        <View className="flex-row items-center space-x-1 border-l pl-1 border-l-gray-400">
          <Icon.Mic height="20" width="20" stroke="gray" />
        </View>
      </View>
    </View>
  );
}
