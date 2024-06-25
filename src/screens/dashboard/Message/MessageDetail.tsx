import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { IMessageDto } from "../../../models/Message";
import { baseUrl } from "../../../api/url.contants";
import Spinner from "../../../components/common/Spinner";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";

interface MessageDetail {
  messageId: number | null; // Corrected prop name
}
export default function MessageDetail() {
  const route = useRoute();
  const navigation = useNavigation();

  const { messageId } = route.params;
  const [message, setMessage] = useState<IMessageDto>({});

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get<IMessageDto>(`${baseUrl}Message/${messageId}`)
      .then((response) => setMessage(response.data));
    setLoading(true);
  }, [messageId, message]);

  if (!loading) return <Spinner />;

  return (
    <ScrollView className="bg-gray-100" style={styles.container}>
      <Text className="text-teal-600 font-bold text-lg m-auto mb-12">
        Create Message
      </Text>
      <Text>Receiver</Text>
      <Text className="bg-white" style={styles.input}>
        {message.receiver}
      </Text>
      <Text>Sender</Text>
      <Text className="bg-white" style={styles.input}>
        {message.sender}
      </Text>
      <Text>Subject</Text>
      <Text className="bg-white" style={styles.input}>
        {message.subject}
      </Text>

      <Text>Details</Text>
      <Text className="bg-white" style={styles.inputArea}>
        {message.details}
      </Text>
      <Text className="bg-gray-100 text-right">
        {" "}
        {moment(message.createdAt).fromNow()}
      </Text>
    </ScrollView>
  );
}

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
    padding: 10,
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
