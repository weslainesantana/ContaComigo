import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../../screens/Onboarding";
import { Sidebar } from "../../components/Sidebar";
import TelaCadastro from "../../screens/Login_CreateAccount/CreateAccount"
import TelaLogin from "../../screens/Login_CreateAccount/Login"

const Stack = createNativeStackNavigator();

export function PublicNavigationRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Main" component={Sidebar} />
      <Stack.Screen name="TelaCadastro" component={TelaCadastro} />
      <Stack.Screen name="TelaLogin" component={TelaLogin} />
    </Stack.Navigator>
  );
}
