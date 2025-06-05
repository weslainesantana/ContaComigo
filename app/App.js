import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RootNavigationContainer } from './src/navigation';

export default function App() {
  return (
    <RootNavigationContainer/>
  );
}
