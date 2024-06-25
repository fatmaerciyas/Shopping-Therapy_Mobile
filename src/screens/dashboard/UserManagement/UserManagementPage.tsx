import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import axiosInstance from "../../../api/axiosInstance";
import { USERS_LIST_URL } from "../../../api/globalConfig";
import Spinner from "../../../components/common/Spinner";
import UserCountSection from "../../../components/user-management/UserCountSection";
import UserChartSection from "../../../components/user-management/UserChartSection";
import LatestUsersSection from "../../../components/user-management/LatestUsersSection";
import UsersTableSection from "../../../components/user-management/UsersTableSection";
import { IAuthUser } from "../../../models/Auth";

const UsersManagementPage = () => {
  const [users, setUsers] = useState<IAuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsersList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IAuthUser[]>(USERS_LIST_URL);
      const { data } = response;
      setUsers(data);
      setLoading(false);
    } catch (error) {
      Alert.alert("An Error happened. Please Contact admins");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersList();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Management</Text>
      <ScrollView>
        <UserCountSection usersList={users} />
        <View style={styles.grid}>
          <UserChartSection usersList={users} />
          <LatestUsersSection usersList={users} />
        </View>
        <UsersTableSection usersList={users} />
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Equivalent to bg-slate-50
    alignItems: "center", // Centers children horizontally
    paddingTop: 8,
  },
  scrollViewContent: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center", // Ensures text is centered
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
};

export default UsersManagementPage;
