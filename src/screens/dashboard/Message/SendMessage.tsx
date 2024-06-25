import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Spinner from "../../../components/common/Spinner";
import * as Yup from "yup"; // Import Yup for schema validation
import { useForm } from "react-hook-form";
import { ISendMessageDto } from "../../../models/Message";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../../api/axiosInstance";
import {
  CREATE_MESSAGE_URL,
  PATH_DASHBOARD,
  USERNAMES_LIST_URL,
} from "../../../api/globalConfig";
import useAuth from "../../../hooks/useAuth.hook";
import { useNavigation } from "@react-navigation/native";

interface MessageState {
  receiver: string;
  subject: string;
  details: string;
  sender: string;
}

const SendMessage = () => {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigation();

  const [message, setMessage] = useState<MessageState>({
    receiver: "",
    subject: "",
    details: "",
    sender: "",
  });

  const sendMessageSchema = Yup.object().shape({
    receiver: Yup.string()
      .required("User Name is required")
      .oneOf(usernames, "Invalid username"),
    details: Yup.string().required("Message detail is required"),
    subject: Yup.string().required("Message subject is required"),
    sender: Yup.string().required("sender subject is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISendMessageDto>({
    resolver: yupResolver(sendMessageSchema),
    defaultValues: {
      receiver: "",
      subject: "",
      details: "",
      sender: "",
    },
  });

  const handleSendMessage = async (message: ISendMessageDto) => {
    try {
      setLoading(true);

      // Send the message object to the server
      const response = await axiosInstance.post(CREATE_MESSAGE_URL, message);

      setLoading(false);
      Alert.alert("Your message has been sent successfully.");
      if (user?.roles.includes("ADMIN")) {
        navigate.navigate("AllMessages"); // Uncomment this line if navigate is defined
      } else {
        navigate.navigate("SenboxMessage"); // Uncomment this line if navigate is defined
      }
    } catch (error) {
      setLoading(false);
      reset();
      const err = error as { data: string; status: number };
      if (err.status === 400) {
        Alert.alert(err.data);
      } else {
        Alert.alert("An error occurred. Please contact administrators.");
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );
  }

  return (
    <ScrollView className="bg-gray-100" style={styles.container}>
      <Text className="text-teal-600 font-bold text-lg m-auto mb-12">
        Send Message
      </Text>
      <Text>Receiver</Text>
      <TextInput
        className="bg-white"
        style={styles.input}
        placeholder="Receiver"
        value={message.receiver}
        onChangeText={(text) => setMessage({ ...message, receiver: text })}
      />
      <Text>Subject</Text>
      <TextInput
        className="bg-white"
        style={styles.input}
        placeholder="Subject"
        value={message.subject}
        onChangeText={(text) => setMessage({ ...message, subject: text })}
      />
      <Text>Details</Text>
      <TextInput
        className="bg-white"
        style={styles.inputArea}
        placeholder="Details"
        value={message.details}
        onChangeText={(text) => setMessage({ ...message, details: text })}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          handleSendMessage({
            sender: user?.userName ?? "Unknown User",
            receiver: message.receiver,
            subject: message.subject,
            details: message.details,
          })
        }
      >
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SendMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputSender: {
    display: "none",
  },
  inputArea: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
