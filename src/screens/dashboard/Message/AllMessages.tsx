import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IAuthUser } from "../../../models/Auth";
import axiosInstance from "../../../api/axiosInstance";
import { ALL_MESSAGES_URL } from "../../../api/globalConfig";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import { IMessageDto } from "../../../models/Message";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AllMessages = () => {
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigation();
  const [users, setUsers] = useState<IAuthUser[]>([]);
  // If adminAccessRoles, show all messages But is is not admin just show messages
  const getAllMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IMessageDto[]>(ALL_MESSAGES_URL);
      const { data } = response;
      setMessages(data);
      setLoading(false);
    } catch (error) {
      Alert.alert("An Error happened. Please Contact admins");
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchdata() {
      await axios
        .get<IAuthUser[]>(baseUrl + "Auth/users")
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => console.log(error));
    }
    fetchdata();
    getAllMessages();
    setLoading(true);
  }, []);

  const handleDelete = (messageId: number) => {
    // e.preventDefault();

    console.log(messageId);

    try {
      axios.post(`${baseUrl}Message/deleteMessage?id=${messageId}`);

      Alert.alert("Deleted message");

      navigate.navigate("AllMessages");

      setLoading(true);
    } catch (error) {
      setLoading(true);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 401) {
        Alert.alert("Somethings went wrong");
      } else {
        Alert.alert("An Error occurred. Please contact admins");
      }
    }
  };

  const navigateToMessageDetail = (messageId: number | null) => {
    navigate.navigate("MessageDetail", {
      messageId: messageId,
    });
  };

  function handleSearch() {
    setLoading(false);

    if (!query) {
      // If the query is empty, show all messages
      getAllMessages();
      return;
    }

    // Filter messages based on the query value
    const filteredMessages = messages.filter((item) => {
      return (
        item.sender.toLowerCase().includes(query.toLowerCase()) ||
        item.subject.toLowerCase().includes(query.toLowerCase())
      );
    });

    console.log(query);
    setMessages(filteredMessages);
  }

  function handlersetQuery(item: string) {
    setQuery(item);
    handleSearch();
  }

  return (
    <View className="bg-gray-100" style={styles.container}>
      <View style={styles.header}>
        <Text className="text-teal-600 font-bold m-auto">All Messages</Text>
      </View>
      <ScrollView className="bg-gray-100" style={styles.emailList}>
        {messages.map((message) => (
          <TouchableOpacity
            key={message.messageId}
            onPress={() => navigateToMessageDetail(message.messageId)}
          >
            <View className="shadow " style={styles.productContainer}>
              <View style={styles.productInfo}>
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{message.subject}</Text>
                  <Text style={styles.productText}>
                    Sender: {message.sender}
                  </Text>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    onPress={() => navigateToMessageDetail(message.messageId)}
                  >
                    <FontAwesome
                      name="arrow-right"
                      size={26}
                      color="#007bff"
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(message.messageId)}
                  >
                    <FontAwesome
                      name="trash"
                      size={26}
                      color="#dc3545"
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.bottomBar}>
        {/* <TouchableOpacity
          onPress={() => navigate.navigate("SendMessage")}
          style={styles.iconContainer}
        >
          <MaterialCommunityIcons
            name="email-send-outline"
            size={30}
            color="#0080B4"
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigate.navigate("SendMessage")}
          style={styles.iconContainer}
        >
          <MaterialCommunityIcons
            name="email-plus-outline"
            size={30}
            color="#0080B4"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate.navigate("InboxMessage")}
          style={styles.iconContainer}
        >
          <MaterialCommunityIcons
            name="email-receive-outline"
            size={30}
            color="#0080B4"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconContainer: {
    padding: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  emailList: {
    flex: 1,
    padding: 16,
  },
  emailContainer: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  sender: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subject: {
    fontSize: 14,
    marginBottom: 8,
  },
  body: {
    fontSize: 12,
    color: "#555",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 1,
  },
  bottomIcon: {
    padding: 8,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productText: {
    fontSize: 16,
    color: "#555",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginLeft: 22,
  },
});

export default AllMessages;
