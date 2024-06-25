import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import useAuth from "../../../hooks/useAuth.hook";
import { useNavigation } from "@react-navigation/native";
import { IMessageDto } from "../../../models/Message";
import { IAuthUser } from "../../../models/Auth";
import Spinner from "../../../components/common/Spinner";

const SendboxPage = () => {
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigation();
  const { user } = useAuth();

  const getMyMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<IMessageDto[]>(
        `${baseUrl}Message/sendbox?userName=${user?.userName}`
      );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "An Error happened while fetching data. Please contact admins."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<IAuthUser[]>(baseUrl + "Auth/users");
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
    getMyMessages();
  }, []);

  const handleDelete = async (messageId: number) => {
    try {
      await axios.post(`${baseUrl}Message/deleteMessage?id=${messageId}`);
      Alert.alert("Deleted message");
      getMyMessages(); // Refresh the messages after deletion
    } catch (error) {
      Alert.alert("An Error occurred. Please contact admins");
    }
  };

  const navigateToMessageDetail = (messageId: number | null) => {
    navigate.navigate("MessageDetail", {
      messageId: messageId,
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <View className="bg-gray-100" style={styles.container}>
      <View style={styles.header}>
        <Text className="text-teal-600 font-bold m-auto">Sendbox</Text>
      </View>
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            There is no messages to show 🧐📩
          </Text>
        </View>
      ) : (
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
                        name="edit"
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
      )}
      <View style={styles.bottomBar}>
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
  emailList: {
    flex: 1,
    padding: 16,
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
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default SendboxPage;
