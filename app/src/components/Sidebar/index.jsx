import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../../screens/Onboarding";
import { Home } from "../../screens/Home";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomDrawerContent } from "../../components/CustomDrawerContent"; // <-- importe aqui
import { Accounts } from "../../screens/Accounts";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MenuButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu" size={25} color="black" />
    </TouchableOpacity>
  );
}

function StackScreens() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => <MenuButton />,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Accounts" component={Accounts} />
    </Stack.Navigator>
  );
}

export function Sidebar() {
  return (
    <Drawer.Navigator
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 160,
          backgroundColor: "#fff",
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          elevation: 2,
        },
      }}
    >
      <Drawer.Screen name="Main" component={StackScreens} />
    </Drawer.Navigator>
  );
}
