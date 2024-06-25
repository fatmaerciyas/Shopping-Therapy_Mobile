import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Register from "./Register";
import { baseUrl } from "../../api/url.contants";
import useAuth from "../../hooks/useAuth.hook";
import { ILoginDto } from "../../models/Auth";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "../../components/common/Spinner";

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const loginSchema = Yup.object().shape({
    userName: Yup.string().required("User Name is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 character"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ILoginDto>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmitLoginForm = async (data: ILoginDto) => {
    try {
      setLoading(true);
      await login(data.userName, data.password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 401) {
        Alert.alert("Invalid Username or Password");
      }
    }
  };
  if (loading) {
    return <Spinner />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>
        <View>
          <Text style={styles.logo}>OneStopShop</Text>
        </View>

        <KeyboardAvoidingView>
          <View>
            <Text style={styles.title}>Login to your Account</Text>
          </View>

          <View>
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
              onChangeText={(text) => setValue("password", text)}
              placeholder="Password"
              secureTextEntry={true}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(onSubmitLoginForm)}
            >
              <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={styles.signUpLink}
          >
            <Text style={styles.signUpText}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
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
  title: {
    fontSize: 18,
    color: "#041E42",
    marginBottom: 70,
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

  signUpLink: {
    marginTop: 10,
  },
  signUpText: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
  },
});
