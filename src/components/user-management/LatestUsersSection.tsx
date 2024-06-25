import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

// Define the IAuthUser interface
interface IAuthUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

// Define the IProps interface
interface IProps {
  usersList: IAuthUser[];
}

const LatestUsersSection: React.FC<IProps> = ({ usersList }) => {
  const navigation = useNavigation();

  const selectedUsers = usersList.sort((a, b) => {
    return a.createdAt < b.createdAt ? 1 : -1;
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest Users 🔑</Text>
      </View>

      <View style={styles.userList}>
        {selectedUsers.slice(0, 7).map((item) => (
          <View key={item.id} style={styles.userItem}>
            <View style={styles.userDetails}>
              <Text style={styles.hash}>✨</Text>
              <Text style={styles.userName}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
            <Text style={styles.createdAt}>
              {moment(item.createdAt).fromNow()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 10,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black", // text-slate-700
  },
  viewAll: {
    fontSize: 12,
    color: "#3B82F6", // text-primary
    borderBottomWidth: 1,
    borderBottomColor: "#3B82F6",
  },
  userList: {
    marginTop: 12,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // bg-gray-100
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  hash: {
    color: "#DC2626", // text-rose-600
  },
  userName: {
    marginLeft: 8,
    fontSize: 16,
  },
  createdAt: {
    fontSize: 14,
    color: "#1E293B", // text-slate-800
  },
});

export default LatestUsersSection;
