import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth.hook";
import { useForm } from "react-hook-form";
import { IRegisterDto } from "../../models/Auth";
import { yupResolver } from "@hookform/resolvers/yup";

import Spinner from "../../components/common/Spinner";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigation = useNavigation();

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    userName: Yup.string().required("User Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Input text must be a valid email"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    address: Yup.string().required("Address Is required"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      address: "",
    },
  });

  const onSubmitRegisterForm = async (data) => {
    try {
      setLoading(true);
      await register(
        data.firstName,
        data.lastName,
        data.userName,
        data.email,
        data.password,
        data.address
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status, data } = err;
      if (status === 400 || status === 409) {
        Alert.alert("Error", data);
      } else {
        Alert.alert("Error", "An Error occurred. Please contact admins");
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View>
          <Text style={styles.logo}>OneStopShop</Text>
        </View>

        <KeyboardAvoidingView style={styles.formContainer}>
          <View>
            <Text style={styles.title}>Register to your Account</Text>
          </View>

          <View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setValue("firstName", text)}
              placeholder="First Name"
            />
            {errors.firstName && (
              <Text style={styles.error}>{errors.firstName.message}</Text>
            )}

            <TextInput
              style={styles.input}
              onChangeText={(text) => setValue("lastName", text)}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <Text style={styles.error}>{errors.lastName.message}</Text>
            )}

            <TextInput
              style={styles.input}
              onChangeText={(text) => setValue("userName", text)}
              placeholder="Username"
            />
            {errors.userName && (
              <Text style={styles.error}>{errors.userName.message}</Text>
            )}

            <TextInput
              style={styles.input}
              onChangeText={(text) => setValue("email", text)}
              placeholder="Email"
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <TextInput
              style={styles.input}
              onChangeText={(text) => setValue("address", text)}
              placeholder="Address"
            />
            {errors.address && (
              <Text style={styles.error}>{errors.address.message}</Text>
            )}

            <TextInput
              style={styles.input}
              onChangeText={(text) => setValue("password", text)}
              placeholder="Password"
              secureTextEntry={true}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmitRegisterForm)}
            >
              <Text style={styles.button}>Register</Text>
            </TouchableOpacity>
          </View>

          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInText}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    textAlign: "center",
    color: "#00CCBB",
    fontWeight: "600",
    fontSize: 40,
  },
  formContainer: {
    width: "100%",
    marginTop: 20, // Add margin top to create space between logo and form
  },
  title: {
    fontSize: 20,
    color: "#041E42",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10, // Add margin bottom to create space between inputs
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20, // Add margin top to create space between inputs and button
    alignItems: "center",
  },
  button: {
    textAlign: "center",
    backgroundColor: "#00CCBB",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
    marginTop: 20,
  },
});
