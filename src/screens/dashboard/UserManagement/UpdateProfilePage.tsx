import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../api/url.contants";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Spinner from "../../../components/common/Spinner";
import { IAuthUser } from "../../../models/Auth";

export default function UpdateProfilePage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [user, setUser] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageURL, setImageURL] = useState<string>("");

  useEffect(() => {
    axios
      .get<IAuthUser>(`${baseUrl}Auth/getByUserId/${id}`)
      .then((response) => {
        setUser(response.data);
        if (response.data.image) {
          setImageURL(response.data.image);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const changeHandler = (name: keyof IAuthUser, value: string) => {
    setUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, [name]: value };
      }
      return prevUser;
    });
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageURI = result.assets[0].uri;
      setImageURL(imageURI);
      changeHandler("image", imageURI);
    }
  };

  const handleSaveBtnClick = async () => {
    if (!user?.userName || !user?.email || !user?.image) {
      Alert.alert("Please Enter All Values");
      return;
    }

    try {
      await axios.post(`${baseUrl}Auth/update-user`, user);
      Alert.alert("User updated successfully");
      navigation.goBack();
    } catch (error) {
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 401) {
        Alert.alert("Something went wrong");
      } else {
        Alert.alert("An Error occurred. Please contact admins");
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Profile</Text>
      {user && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={(value) => changeHandler("email", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={user.firstName}
              onChangeText={(value) => changeHandler("firstName", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={user.lastName}
              onChangeText={(value) => changeHandler("lastName", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image</Text>
            <Button title="Choose Image" onPress={handleImagePicker} />
            {imageURL ? (
              <Image source={{ uri: imageURL }} style={styles.image} />
            ) : null}
          </View>
          <Button title="Save" onPress={handleSaveBtnClick} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    color: "#4B0082",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
});
