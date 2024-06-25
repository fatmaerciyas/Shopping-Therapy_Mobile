import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const images = [
  {
    id: 1,
    src: require("../../assets/images/backgrounds/home1.jpg"),
    title: "Instant discounts",
    description: "Cheaper and better quality than you can imagine",
  },
  {
    id: 2,
    src: require("../../assets/images/backgrounds/home-bg.jpg"),
    title: "Comfortable",
    description: "Make yourself comfortable with wide fit",
  },
  {
    id: 3,
    src: require("../../assets/images/categories/fashion.jpg"),
    title: "Cool",
    description: "Choose your style and be cool",
  },
];

const Slider: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentImage, setCurrentImage] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      scrollViewRef.current?.scrollTo({
        x: width * ((currentImage + 1) % images.length),
        animated: true,
      });
      setCurrentImage((currentImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.slider}
      onMomentumScrollEnd={(event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentImage(newIndex);
      }}
    >
      {images.map(({ id, src, title, description }) => (
        <View key={id} style={styles.slide}>
          <Image source={src} style={styles.image} resizeMode="cover" />
          <View style={styles.overlay}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.littleText}>{description}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: height / 3,
  },
  slide: {
    width,
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "flex-start", // Align text to the left
    paddingHorizontal: 20, // Add some padding to the sides
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  text: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 5,
  },
  littleText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Slider;
