import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import Home from "../screens/public/Home";
import Register from "../screens/public/Register";
import Login from "../screens/public/Login";
import ProductDetail from "../screens/public/ProductDetail";
import { createStackNavigator } from "@react-navigation/stack";
import CartPage from "../screens/public/Cart";
import Checkout from "../screens/public/Checkout";
import AuthProvider from "../auth/auth.context";
import BottomNavigator from "./bottomNavigator";
import WelcomePage from "../screens/dashboard/User/WelcomePage";
import WelcomeAdmin from "../screens/dashboard/Admin/WelcomeAdmin";
import ThankYouPage from "../screens/public/ThankYou";
import OrderPrepairing from "../screens/public/OrderPrepairing";
import CreditCardPage from "../screens/public/PayCard";
import Catalog from "../screens/public/Catalog";
import AddProduct from "../screens/dashboard/Product/AddProduct";
import ProductManagement from "../screens/dashboard/Product/ProductManagement";
import CategoryManagement from "../screens/dashboard/Category/CategoryManagement";
import AddCategory from "../screens/dashboard/Category/AddCategory";
import Order from "../screens/dashboard/Order/Order";
import AllMessages from "../screens/dashboard/Message/AllMessages";
import SendMessage from "../screens/dashboard/Message/SendMessage";
import MessageDetail from "../screens/dashboard/Message/MessageDetail";
import InboxPage from "../screens/dashboard/Message/InboxPage";
import CargoManagement from "../screens/dashboard/Cargo/cargoManagement";
import UpdateCargoStatusPage from "../screens/dashboard/Cargo/updateCargoStatus";
import UsersManagementPage from "../screens/dashboard/UserManagement/UserManagementPage";
import UpdateRolePage from "../screens/dashboard/UserManagement/UpdateRolePage";
import ShowUsersPage from "../screens/dashboard/UserManagement/ShowUsersPage";
import UpdateProfilePage from "../screens/dashboard/UserManagement/UpdateProfilePage";
import MyCargos from "../screens/dashboard/Cargo/myCargos";
import SendboxPage from "../screens/dashboard/Message/SendboxPage";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              options={{ headerShown: false }}
              initialParams={{
                id: undefined as number | undefined,
              }}
            />
            <Stack.Screen
              name="CartPage"
              component={CartPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Record"
              component={CartPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Checkout"
              component={Checkout}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ThankYou"
              component={ThankYouPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OrderPrepairing"
              component={OrderPrepairing}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreditCardPage"
              component={CreditCardPage}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Welcome"
              component={WelcomePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Catalog"
              component={Catalog}
              options={{ headerShown: false }}
            />
            {/* Admin */}
            <Stack.Screen
              name="WelcomeAdmin"
              component={WelcomeAdmin}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="AddProduct"
              component={AddProduct}
              initialParams={{ productId: null }}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ProductManagement"
              component={ProductManagement}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CategoryManagement"
              component={CategoryManagement}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddCategory"
              component={AddCategory}
              initialParams={{ categoryId: null }}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Order"
              component={Order}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="AllMessages"
              component={AllMessages}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="SendMessage"
              component={SendMessage}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="InboxMessage"
              component={InboxPage}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="SenboxMessage"
              component={SendboxPage}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="BottomNavigator"
              component={BottomNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MessageDetail"
              component={MessageDetail}
              initialParams={{ messageId: null }}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CargoManagement"
              component={CargoManagement}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="UpdateCargoStatus"
              component={UpdateCargoStatusPage}
              initialParams={{ cartId: null }}
              options={{ headerShown: false }}
            />

            {/* UserManagement */}
            <Stack.Screen
              name="UserManagement"
              component={UsersManagementPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UpdateRole"
              component={UpdateRolePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ShowUsersPage"
              component={ShowUsersPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UpdateProfilePage"
              component={UpdateProfilePage}
              initialParams={{ id: null }}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MyCargos"
              component={MyCargos}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <BottomNavigator />
        </AuthProvider>
      </NavigationContainer>
    </>
  );
}
