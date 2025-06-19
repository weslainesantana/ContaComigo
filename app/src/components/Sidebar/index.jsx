import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Home } from "../../screens/Home";
import { Accounts } from "../../screens/Accounts";
import Login from "../../screens/Login_CreateAccount/Login";
import { CustomDrawerContent } from "../../components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const Drawer = createDrawerNavigator();
const screenWidth = Dimensions.get("window").width;

export function MenuButton({ navigation, iconColor }) {
  return (
    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu" size={25} color={iconColor} />
    </TouchableOpacity>
  );
}

export function Sidebar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const drawerBackground = isDark ? "#1f2937" : "#fff";
  const drawerActiveTintColor = isDark ? "#60a5fa" : "#3b82f6";
  const drawerInactiveTintColor = isDark ? "#9ca3af" : "#6b7280";
  const headerBackground = isDark ? "#111827" : "#f9fafb";
  const headerTintColor = isDark ? "#f9fafb" : "#111827";
  const iconColor = isDark ? "#f9fafb" : "#111827";

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerLeft: () => <MenuButton navigation={navigation} iconColor={iconColor} />,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: headerBackground,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: headerTintColor,
        drawerStyle: {
          width: screenWidth * 0.5,
          backgroundColor: drawerBackground,
        },
        drawerActiveTintColor: drawerActiveTintColor,
        drawerInactiveTintColor: drawerInactiveTintColor,
        drawerLabelStyle: {
          fontWeight: "600",
        },
      })}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Accounts" component={Accounts} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
}