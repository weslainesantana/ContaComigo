import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../../screens/Onboarding";
import { Home } from "../../screens/Home";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Botão de menu no topo
function MenuButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
}

// Stack com as telas
function StackScreens() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => <MenuButton />,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      
      {/* Adicione outras telas aqui */}
    </Stack.Navigator>
  );
}

export function Sidebar() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="App" component={StackScreens} />
    </Drawer.Navigator>
  );
}
