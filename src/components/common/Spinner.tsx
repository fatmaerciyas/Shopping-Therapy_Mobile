import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface SpinnerProps {
  size?: "small" | "large";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "large" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#00CCBB" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Background color set to white
  },
});

export default Spinner;
