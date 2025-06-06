import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../../screens/Onboarding";
import { Sidebar } from "../../components/Sidebar";

const Stack = createNativeStackNavigator();

export function PublicNavigationRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Main" component={Sidebar} />
    </Stack.Navigator>
  );
}
