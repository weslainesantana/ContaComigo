import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const Stack = createNativeStackNavigator()
  return (
    <NavigationContainer> 
      <Stack.Screen name=''/>
    </NavigationContainer>
  );
}
