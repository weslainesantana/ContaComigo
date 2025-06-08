import { DrawerContentScrollView } from "@react-navigation/drawer";
import { CommonActions, useNavigation } from "@react-navigation/native"; // <-- IMPORTANTE
import { Text, TouchableOpacity } from "react-native";

export function CustomDrawerContent() {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView style={{ padding: 16, backgroundColor: "#fff" }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1e66fd",
          marginBottom: 24,
        }}
      >
        ContaComigo
      </Text>

      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            CommonActions.navigate({
              name: "Main",
              params: { screen: "Home" },
            })
          )
        }
      >
        <Text style={{ color: "#1e66fd", marginBottom: 16 }}>/Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            CommonActions.navigate({
              name: "Main",
              params: { screen: "Accounts" },
            })
          )
        }
      >
        <Text style={{ color: "#1e66fd", marginBottom: 16 }}>/Contas</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {/* futura navegação */}}>
        <Text style={{ color: "#1e66fd", marginBottom: 16 }}>/Nova Conta</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
