import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text, TouchableOpacity } from "react-native";

export function CustomDrawerContent({ navigation }) {
  return (
    <DrawerContentScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1e66fd",marginBottom: 24 }}>
        ContaComigo
      </Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
          navigation.closeDrawer();
        }}
      >
        <Text style={{ color: "#1e66fd",marginBottom: 16 }}>/Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Accounts");
          navigation.closeDrawer();
        }}
      >
        <Text style={{ color: "#1e66fd",marginBottom: 16 }}>/Contas</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}