import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import Spinner from "../../../components/common/Spinner";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { IAuthUser } from "../../../models/Auth";

export default function ShowUsersPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<IAuthUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IAuthUser[]>([]);

  const navigate = useNavigation();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<IAuthUser[]>(baseUrl + "Auth/users");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoaded(true);
    }
    fetchData();
  }, []);

  const navigateToUpdateProfile = (id: number | null | string) => {
    navigate.navigate("UpdateProfilePage", {
      id: id,
    });
  };

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.userName} ${user.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (!isLoaded) return <Spinner />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Management</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredUsers.map((user) => (
        <TouchableOpacity
          key={user.id}
          onPress={() => navigateToUpdateProfile(user.id)}
        >
          <View style={styles.userContainer}>
            <View style={styles.userInfo}>
              <Image source={{ uri: user.image }} style={styles.userImage} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  Name: {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.userText}>Username: {user.userName}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 24,
    color: "#4B0082",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchBar: {
    marginBottom: 20,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userText: {
    fontSize: 15,
    color: "#555",
  },
});
