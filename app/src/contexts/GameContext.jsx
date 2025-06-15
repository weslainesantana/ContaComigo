import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text } from 'react-native';

const GameContext = createContext();

// Constantes para XP
export const XP_EVENTS = {
  PAY_ON_TIME: 50,
  PAY_EARLY: 75,
  ADD_ACCOUNT: 10,
  MONTHLY_PERFECT: 200,
  DELETE_ACCOUNT: -5,
};

// Conquistas
export const ACHIEVEMENTS = {
  FIRST_BLOOD: { 
    id: 'FIRST_BLOOD', 
    name: 'Primeiro Pagamento!', 
    description: 'Você pagou sua primeira conta.' 
  },
  ON_TIME_STREAK_3: { 
    id: 'ON_TIME_STREAK_3', 
    name: 'Pontualidade', 
    description: 'Pagou 3 contas em dia seguidas.' 
  },
  ON_TIME_STREAK_10: { 
    id: 'ON_TIME_STREAK_10', 
    name: 'Mestre da Pontualidade', 
    description: 'Pagou 10 contas em dia seguidas.' 
  },
  EARLY_BIRD: { 
    id: 'EARLY_BIRD', 
    name: 'Pássaro Madrugador', 
    description: 'Pagou uma conta com 5+ dias de antecedência.' 
  },
  ACCOUNT_MANAGER: { 
    id: 'ACCOUNT_MANAGER', 
    name: 'Gerente de Contas', 
    description: 'Adicionou 10 contas.' 
  },
  SAVER: { 
    id: 'SAVER', 
    name: 'Economizador', 
    description: 'Pagou todas as contas do mês em dia.' 
  },
};

export const GameProvider = ({ children }) => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(200);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@gameData');
        if (savedData) {
          const { level, xp, xpToNextLevel, unlockedAchievements } = JSON.parse(savedData);
          setLevel(level);
          setXp(xp);
          setXpToNextLevel(xpToNextLevel);
          setUnlockedAchievements(unlockedAchievements || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do jogo:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadGameData();
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      const saveGameData = async () => {
        try {
          const gameData = { 
            level, 
            xp, 
            xpToNextLevel, 
            unlockedAchievements 
          };
          await AsyncStorage.setItem('@gameData', JSON.stringify(gameData));
        } catch (error) {
          console.error('Erro ao salvar dados do jogo:', error);
        }
      };
      
      saveGameData();
    }
  }, [level, xp, xpToNextLevel, unlockedAchievements, isInitialLoad]);

  // Verificar level up
  useEffect(() => {
    if (xp >= xpToNextLevel) {
      const remainingXp = xp - xpToNextLevel;
      setLevel(prev => prev + 1);
      setXp(remainingXp);
      setXpToNextLevel(prev => Math.floor(prev * 1.5));
      showNotification(`Level Up! Agora você é nível ${level + 1}`);
    }
  }, [xp, xpToNextLevel]);

  const showNotification = (message, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  const addXp = (amount) => {
    if (amount !== 0) {
      setXp(prev => prev + amount);
      if (amount > 0) {
        showNotification(`+${amount} XP ganho!`);
      }
    }
  };

  const unlockAchievement = (achievement) => {
    setUnlockedAchievements(prev => {
      if (!prev.find(a => a.id === achievement.id)) {
        showNotification(`Conquista: ${achievement.name}`);
        return [...prev, achievement];
      }
      return prev;
    });
  };

  return (
    <GameContext.Provider 
      value={{ 
        level, 
        xp, 
        xpToNextLevel, 
        unlockedAchievements, 
        addXp, 
        unlockAchievement,
        notification
      }}
    >
      {children}
      {notification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}
    </GameContext.Provider>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};