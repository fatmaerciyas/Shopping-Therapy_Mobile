import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface IProps {
  count: number;
  role: string;
  icon: string; // icon name as string
  color: string;
}

const UserCountCard: React.FC<IProps> = ({ count, role, icon, color }) => {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <FontAwesome name={icon} size={30} color="white" style={styles.icon} />
      <View>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    padding: 4,
  },
  role: {
    fontSize: 16,
    color: "black",
  },
  icon: {
    paddingRight: 12,
  },
});

export default UserCountCard;
