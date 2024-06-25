import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const CreditCardPage = () => {
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [cardHolder, setCardHolder] = React.useState("");
  const navigation = useNavigation();

  const handleSubmit = () => {
    navigation.navigate("OrderPrepairing");
  };

  // Disable submit button if any information is empty
  const isSubmitDisabled =
    cardNumber.trim() === "" ||
    expiryDate.trim() === "" ||
    cvv.trim() === "" ||
    cardHolder.trim() === "";

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Please enter credit card information</Text>
      <View style={styles.cardContainer}>
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardLabel}>Card Number</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
            maxLength={19}
          />
        </View>
        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <Text style={styles.cardLabel}>Expiry Date</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="MM/YY"
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={styles.cardColumn}>
            <Text style={styles.cardLabel}>CVV</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="XXX"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>
        <Text style={styles.cardLabel}>Card Holder Name</Text>
        <TextInput
          style={styles.cardInput}
          placeholder="John Doe"
          value={cardHolder}
          onChangeText={setCardHolder}
        />
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/backgrounds/delivery.gif")}
          style={styles.image}
        />
      </View>
      <TouchableOpacity
        style={[styles.button, isSubmitDisabled && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
      >
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
  },
  cardContainer: {
    width: "90%",
    backgroundColor: "#F0FFFF",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#00CCBB",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 14,
    color: "#333",
  },
  cardInput: {
    height: 34,
    borderColor: "#00CCBB",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cardNumberContainer: {
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardColumn: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#00CCBB",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 40,
  },
  disabledButton: {
    backgroundColor: "#ccc", // Use a different color or style for disabled button
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default CreditCardPage;
