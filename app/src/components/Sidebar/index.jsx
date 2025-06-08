import { createDrawerNavigator } from "@react-navigation/drawer";
import { Home } from "../../screens/Home";
import { Accounts } from "../../screens/Accounts";
import { CustomDrawerContent } from "../../components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const Drawer = createDrawerNavigator();

// Componente do botão de menu
export function MenuButton({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={{ marginLeft: 15 }}
    >
      <Ionicons name="menu" size={25} color="black" />
    </TouchableOpacity>
  );
}

export function Sidebar() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerTitleAlign: "center",
        drawerStyle: {
          width: 160,
        },
      })}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Accounts" component={Accounts} />
    </Drawer.Navigator>
  );
}