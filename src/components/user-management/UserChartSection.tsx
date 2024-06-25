import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { IAuthUser, RolesEnum } from "../../models/Auth";

interface IProps {
  usersList: IAuthUser[];
}

const UserChartSection: React.FC<IProps> = ({ usersList }) => {
  const chartLabels = [
    RolesEnum.OWNER,
    RolesEnum.ADMIN,
    RolesEnum.MANAGER,
    RolesEnum.USER,
  ];

  const ownersCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.OWNER)
  ).length;

  const adminsCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.ADMIN)
  ).length;

  const managersCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.MANAGER)
  ).length;

  const usersCount = usersList.filter((q) =>
    q.roles.includes(RolesEnum.USER)
  ).length;

  const chartValues = [ownersCount, adminsCount, managersCount, usersCount];

  const screenWidth = Dimensions.get("window").width;

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        color: (opacity = 1) => `rgba(9, 181, 33, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Chart 📊</Text>
      <LineChart
        data={chartData}
        width={screenWidth * 0.9} // from react-native
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
});

export default UserChartSection;
