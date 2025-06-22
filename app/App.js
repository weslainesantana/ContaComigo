import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AccountsProvider } from './src/contexts/AccountsContext';
import { RootNavigationContainer } from './src/navigation';
import { GameProvider } from './src/contexts/GameContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <PaperProvider>
      <GameProvider>
        <AccountsProvider>
          <ThemeProvider>
            <RootNavigationContainer />
          </ThemeProvider>
        </AccountsProvider>
      </GameProvider>
    </PaperProvider>
  );
}