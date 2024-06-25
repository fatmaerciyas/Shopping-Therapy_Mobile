import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import UserCountCard from "./UserCountCard";
import { IAuthUser, RolesEnum } from "../../models/Auth";

interface IProps {
  usersList: IAuthUser[];
}

const UserCountSection: React.FC<IProps> = ({ usersList }) => {
  let owners = 0;
  let admins = 0;
  let managers = 0;
  let users = 0;

  usersList.forEach((item) => {
    if (item.roles.includes(RolesEnum.OWNER)) {
      owners++;
    } else if (item.roles.includes(RolesEnum.ADMIN)) {
      admins++;
    } else if (item.roles.includes(RolesEnum.MANAGER)) {
      managers++;
    } else if (item.roles.includes(RolesEnum.USER)) {
      users++;
    }
  });

  const userCountData = [
    {
      count: admins,
      role: RolesEnum.ADMIN,
      icon: "user",
      color: "rgb(165, 243, 252)",
    },

    {
      count: users,
      role: RolesEnum.USER,
      icon: "user",
      color: "rgb(167, 243, 208)",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {userCountData.map((item, index) => (
          <UserCountCard
            key={index}
            count={item.count}
            role={item.role}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});

export default UserCountSection;
