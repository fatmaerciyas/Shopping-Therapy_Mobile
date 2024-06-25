import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Image } from "react-native";
import { Text, View } from "react-native";

export default function OrderPrepairing() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("ThankYou");
    }, 3000);
  }, []);
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Image
        source={require("../../assets/images/backgrounds/delivery.gif")}
        className="h-80 w-screen"
      />
    </View>
  );
}
