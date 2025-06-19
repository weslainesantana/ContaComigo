import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext"; // ajuste o caminho se necessário

export function CustomDrawerContent({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

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
          <Text style={{ fontSize:16, marginLeft: 10, }}>
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
    </DrawerContentScrollView>
  );
}