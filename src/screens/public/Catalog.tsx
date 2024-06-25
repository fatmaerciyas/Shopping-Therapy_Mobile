import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Icon from "react-native-feather";
import axios from "axios";
import { Audio } from "expo-av";
import { Product } from "../../models/Product";
import { baseUrl } from "../../api/url.contants";
import Spinner from "../../components/common/Spinner";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";

const windowWidth = Dimensions.get("window").width;
const itemWidth = (windowWidth - 40) / 2; // Calculate item width based on screen width

const Catalog: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcriptionText, setTranscriptionText] = useState<string>("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Product[]>(baseUrl + "Product");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording...");
    setIsRecording(false);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      const transcription = await transcribeAudio(uri!);
      setTranscriptionText(transcription); // Update the transcription text
      setSearchInput(transcription);
      handleInputChange(transcription);
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      const apiKey = "YOUR_GOOGLE_CLOUD_SPEECH_TO_TEXT_API_KEY";

      const audioData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axios.post(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          config: {
            encoding: "MP3", // Updated encoding type to match recorded audio format
            sampleRateHertz: 44100, // Updated sample rate to match recorded audio format
            languageCode: "en-US",
          },
          audio: {
            content: audioData,
          },
        }
      );

      const transcription = response.data.results
        .map((result: any) => result.alternatives[0].transcript)
        .join("\n");

      console.log("Transcription: ", transcription);
      return transcription;
    } catch (error: any) {
      console.error(
        "Error transcribing audio: ",
        error.response.data.error.message
      );
      return "Transcription failed";
    }
  };

  const handleInputChange = (searchInput: string) => {
    setSearchInput(searchInput);
    // Update products based on search input
    const filteredProducts = searchInput
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchInput.toLowerCase())
        )
      : products;
    setProducts(filteredProducts);
  };

  const navigateToProductDetail = (productId: number, product: Product) => {
    navigation.navigate("ProductDetail", {
      productId: product.productId,
    });
  };

  return (
    <ScrollView style={styles.container} className="bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <View className="flex-row items-end space-x-2 pb-2 mx-2 my-4">
              <View className="flex-row flex-1 items-center pb-1 gap-2 bg-white shadow rounded-full mx-1 px-2">
                <View>
                  <Icon.Search height="18" width="18" stroke="gray" />
                </View>
                <TextInput
                  placeholder="Search..."
                  className="flex-1"
                  onChangeText={handleInputChange}
                  value={searchInput}
                />
                <TouchableOpacity
                  onPress={isRecording ? stopRecording : startRecording}
                  className="flex-row items-center space-x-1 border-l pl-1 border-l-gray-400"
                >
                  <Icon.Mic height="20" width="20" stroke="gray" />
                  <Text>{isRecording ? "Stop" : "Start"} Listening</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.transcriptionText}>
              {transcriptionText ? `You said: "${transcriptionText}"` : ""}
            </Text>
            <View style={styles.productContainer}>
              {products.map((item, index) => (
                <Pressable
                  onPress={() => navigateToProductDetail(item.productId, item)}
                  key={index}
                  style={[styles.cartItem, { width: itemWidth }]}
                >
                  {item && (
                    <>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.productImage}
                      />
                      <View style={{ marginBottom: 8 }}>
                        <Text className="text-lg  mb-1">{item.name}</Text>
                        <View className="flex flex-row justify-between items-center">
                          <Text className="text-sm text-green-700 mr-2">
                            {item.price}
                          </Text>
                          <Text className="text-sm text-red-500 line-through">
                            {item.price + 20}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    paddingBottom: 30,
  },
  transcriptionText: {
    fontSize: 16,
    color: "black",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  cartItem: {
    marginBottom: 10,
    shadowColor: "#000",
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    borderRadius: 10,
  },
});

export default Catalog;
