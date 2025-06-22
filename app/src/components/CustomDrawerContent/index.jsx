import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export function CustomDrawerContent({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Onboarding" }],
          });
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1e66fd" }}>
          ContaComigo
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, marginLeft: 10 }}>
            {isDark ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
          navigation.closeDrawer();
        }}
      >
        <Text style={{ color: "#1e66fd", marginBottom: 16 }}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Accounts");
          navigation.closeDrawer();
        }}
      >
        <Text style={{ color: "#1e66fd", marginBottom: 16 }}>Contas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{ marginTop: 40 }}
      >
        <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}