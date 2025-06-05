import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

export default function Onboarding(){
    const navigation = useNavigation()
    return(
        <View style = {{flex:1, justifyContent:"center", alignItems:"center"}}> 
         <Text>Bem-vindo</Text>
       <Button 
        title="Ir para Home"
        onPress={() => {
            if (navigation) navigation.navigate("Home");
        }}
        />
        </View>
    )
}