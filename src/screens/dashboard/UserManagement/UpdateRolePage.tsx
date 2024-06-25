import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IAuthUser, IUpdateRoleDto } from "../../../models/Auth";
import useAuth from "../../../hooks/useAuth.hook";
import axiosInstance from "../../../api/axiosInstance";
import { UPDATE_ROLE_URL, USERS_LIST_URL } from "../../../api/globalConfig";
import {
  allowedRolesForUpdateArray,
  isAuthorizedForUpdateRole,
} from "../../../auth/auth.utils";
import Spinner from "../../../components/common/Spinner";

const UpdateRolePage: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { userName } = route.params as { userName: string };

  const [user, setUser] = useState<IAuthUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Array<{ label: string; value: string }>>(
    []
  );

  const getUserByUserName = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IAuthUser>(
        `${USERS_LIST_URL}/${userName}`
      );
      const data = response.data;

      if (!isAuthorizedForUpdateRole(loggedInUser!.roles[0], data.roles[0])) {
        setLoading(false);
        // Handle unauthorized access
      } else {
        setUser(data);
        setRole(data.roles[0]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  };

  const updateRole = async () => {
    try {
      if (!role || !userName) return;
      setPostLoading(true);
      const updateData: IUpdateRoleDto = {
        newRole: role,
        userName,
      };
      await axiosInstance.post(UPDATE_ROLE_URL, updateData);
      setPostLoading(false);
      Alert.alert("Role updated succesfully ✅");
      // Handle success
    } catch (error) {
      setPostLoading(false);
      // Handle error
    }
  };

  useEffect(() => {
    getUserByUserName();
  }, []);

  useEffect(() => {
    setItems(
      allowedRolesForUpdateArray(loggedInUser).map((role) => ({
        label: role,
        value: role,
      }))
    );
  }, [loggedInUser]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Role</Text>
      <View style={styles.card}>
        <Text style={styles.text}>
          UserName:{" "}
          <Text style={styles.highlightedText} className="text-teal-700">
            {userName}
          </Text>
        </Text>
        <Text style={styles.text}>
          Current Role:{" "}
          <Text style={styles.highlightedText} className="text-teal-700">
            {user?.roles[0]}
          </Text>
        </Text>
      </View>

      <Text style={styles.label} className="text-teal-600">
        New Role:
      </Text>
      <Dropdown
        style={styles.dropdown}
        data={items}
        labelField="label"
        valueField="value"
        placeholder="Select a role"
        value={role}
        onChange={(item) => setRole(item.value)}
      />

      <TouchableOpacity
        onPress={updateRole}
        style={styles.button}
        className="bg-teal-600"
      >
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 22,
    color: "#00CCBB",
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#dda0dd",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  highlightedText: {
    fontSize: 20,
    marginLeft: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default UpdateRolePage;
