import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import StackNavigator from "./src/navigation/stackNavigator";
import BottomNavigator from "./src/navigation/bottomNavigator";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StackNavigator />
    </>
  );
}
