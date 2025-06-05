import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Onboarding from "../../screens/Onboarding"
import { Home } from "../../screens/Home"

export function PublicNavigationRoutes(){
    const Stack = createNativeStackNavigator()
    return(
        <Stack.Navigator initialRouteName="Onboarding" screenOptions={{headerShown:false}}> 
            <Stack.Screen name="Onboarding" component={Onboarding}/>
            <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
    )
}