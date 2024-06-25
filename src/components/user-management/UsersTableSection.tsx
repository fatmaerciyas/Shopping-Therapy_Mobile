import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { IAuthUser, RolesEnum } from "../../models/Auth";
import useAuth from "../../hooks/useAuth.hook";
import { isAuthorizedForUpdateRole } from "../../auth/auth.utils";

interface IProps {
  usersList: IAuthUser[];
}

const UsersTableSection: React.FC<IProps> = ({ usersList }) => {
  const { user: loggedInUser } = useAuth();
  const navigation = useNavigation();

  const RoleClassNameCreator = (roles: string[]) => {
    if (roles.includes(RolesEnum.OWNER)) {
      return styles.ownerRole;
    } else if (roles.includes(RolesEnum.ADMIN)) {
      return styles.adminRole;
    } else if (roles.includes(RolesEnum.MANAGER)) {
      return styles.managerRole;
    } else if (roles.includes(RolesEnum.USER)) {
      return styles.userRole;
    }
    return {};
  };

  return (
    <ScrollView horizontal>
      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={styles.title}> Users 🔓</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ShowUsersPage")}
            style={styles.title}
          >
            <Text>See all users➡️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.header}>
          <Text style={[styles.headerText, styles.smallCell]}>No</Text>
          <Text style={[styles.headerText, styles.mediumCell]}>Created</Text>
          <Text style={[styles.headerText, styles.mediumCell]}>Username</Text>
          <Text style={[styles.headerText, styles.largeCell]}>Email</Text>
          <Text style={[styles.headerText, styles.largeCell]}>Roles</Text>
          <Text style={[styles.headerText, styles.mediumCell]}>Operations</Text>
        </View>
        {usersList.map((user, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.smallCell]}>{index + 1}</Text>
            <Text style={[styles.cell, styles.mediumCell]}>
              {moment(user.createdAt).format("YY-MM-DD|HH:mm")}
            </Text>
            <View style={[styles.userCell, styles.mediumCell]}>
              <Image source={{ uri: user.image }} style={styles.avatar} />
              <Text style={styles.cell}>{user.userName}</Text>
            </View>
            <Text style={[styles.cell, styles.largeCell]}>{user.email}</Text>
            <View
              style={[
                styles.cell,
                styles.largeCell,
                RoleClassNameCreator(user.roles),
              ]}
            >
              <Text style={styles.roleText}>{user.roles.join(", ")}</Text>
            </View>
            <View style={[styles.cell, styles.mediumCell]}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() =>
                  navigation.navigate("UpdateRole", { userName: user.userName })
                }
                disabled={
                  !isAuthorizedForUpdateRole(
                    loggedInUser!.roles[0],
                    user.roles[0]
                  )
                }
              >
                <Text>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    flexDirection: "column",
    margin: 10,
    borderRadius: 10,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black", // text-slate-700
    margin: 20,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    textAlign: "center",
    padding: 8,
    fontSize: 12,
  },
  smallCell: {
    width: 40,
  },
  mediumCell: {
    width: 100,
  },
  largeCell: {
    width: 140,
  },
  userCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  roleText: {
    fontSize: 12,
  },
  ownerRole: {
    backgroundColor: "rgba(0, 128, 0, 0.1)",
    color: "green",
  },
  adminRole: {
    backgroundColor: "rgba(0, 255, 0, 0.3)",
    color: "blue",
    borderRadius: 18,
  },
  managerRole: {
    backgroundColor: "rgba(0, 128, 128, 0.1)",
    color: "teal",
    borderRadius: 18,
  },
  userRole: {
    backgroundColor: "rgba(255, 160, 0, 0.3)",
    color: "orange",
    borderRadius: 18,
  },
  button: {
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 255, 0.1)",
    padding: 8,
    borderRadius: 18,
  },
});

export default UsersTableSection;
