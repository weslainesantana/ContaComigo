import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AccountsProvider } from './src/contexts/AccountsContext'; // Ajuste o caminho conforme necessário
import { RootNavigationContainer } from './src/navigation';
import { GameProvider } from './src/contexts/GameContext';

export default function App() {
  return (
    <PaperProvider>
      <GameProvider>
        <AccountsProvider>
          <RootNavigationContainer />
        </AccountsProvider>
      </GameProvider>
    </PaperProvider>
  );
}