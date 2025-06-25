import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text } from 'react-native';
import { gamificationApi } from '../services/api';

const GameContext = createContext();

export const XP_EVENTS = {
  PAY_ON_TIME: 50,
  PAY_EARLY: 75,
  ADD_ACCOUNT: 10,
  MONTHLY_PERFECT: 200,
  DELETE_ACCOUNT: -5,
};

export const ACHIEVEMENTS = {
  FIRST_BLOOD: { id: 'FIRST_BLOOD', name: 'Primeiro Pagamento!', description: 'Você pagou sua primeira conta.' },
  ON_TIME_STREAK_3: { id: 'ON_TIME_STREAK_3', name: 'Pontualidade', description: 'Pagou 3 contas em dia seguidas.' },
  ON_TIME_STREAK_10: { id: 'ON_TIME_STREAK_10', name: 'Mestre da Pontualidade', description: 'Pagou 10 contas em dia seguidas.' },
  EARLY_BIRD: { id: 'EARLY_BIRD', name: 'Pássaro Madrugador', description: 'Pagou uma conta com 5+ dias de antecedência.' },
  ACCOUNT_MANAGER: { id: 'ACCOUNT_MANAGER', name: 'Gerente de Contas', description: 'Adicionou 10 contas.' },
  SAVER: { id: 'SAVER', name: 'Economizador', description: 'Pagou todas as contas do mês em dia.' },
};

export const GameProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(200);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [notification, setNotification] = useState(null);

  // Efeito para checar sessão existente ao abrir o app
  useEffect(() => {
    const checkExistingSession = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        setIsInitialLoad(false);
      }
    };
    checkExistingSession();
  }, []);

  // Efeito para CARREGAR os dados quando 'email' é definido
  useEffect(() => {
    const loadGameData = async () => {
      if (!email) {
        setLevel(1);
        setXp(0);
        setXpToNextLevel(200);
        setUnlockedAchievements([]);
        setIsInitialLoad(false);
        return;
      }

      setIsInitialLoad(true);
      try {
        // CORREÇÃO: Busca todos os achievements, como você disse.
        const response = await gamificationApi.get('/achievements');
        // Filtra no lado do cliente
        const userData = response.data.find(item => item.email === email);

        if (userData) {
          setLevel(userData.level || 1);
          setXp(userData.xp || 0);
          setXpToNextLevel(userData.xpToNextLevel || 200);
          setUnlockedAchievements(userData.unlockedAchievements || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do jogo:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    loadGameData();
  }, [email]);

  // Efeito para SALVAR (ou CRIAR) os dados
  useEffect(() => {
    if (isInitialLoad || !email) {
      return;
    }

    const saveGameData = async () => {
      const payload = { email, level, xp, xpToNextLevel, unlockedAchievements };
      try {
        // CORREÇÃO: Busca todos e filtra para encontrar o ID
        const response = await gamificationApi.get('/achievements');
        const existingUser = response.data.find(item => item.email === email);
        
        if (existingUser) {
          // Se EXISTE, atualiza (PUT)
          await gamificationApi.put(`/achievements/${existingUser.id}`, payload);
        } else {
          // Se NÃO EXISTE, cria (POST)
          await gamificationApi.post('/achievements', payload);
        }
      } catch (error) {
        console.error('Erro ao salvar/criar dados do jogo:', error);
      }
    };
    
    const debounceSave = setTimeout(saveGameData, 1500);
    return () => clearTimeout(debounceSave);

  }, [level, xp, xpToNextLevel, unlockedAchievements]);

  // Efeito de Level Up
  useEffect(() => {
    if (xp >= xpToNextLevel) {
      const newLevel = level + 1;
      const remainingXp = xp - xpToNextLevel;
      setLevel(newLevel);
      setXp(remainingXp);
      setXpToNextLevel(prev => Math.floor(prev * 1.5));
      showNotification(`Level Up! Agora você é nível ${newLevel}`);
    }
  }, [xp, xpToNextLevel, level]);

  const loginUser = (userEmail) => {
    if (userEmail) setEmail(userEmail);
  };

  const logoutUser = async () => {
    await AsyncStorage.removeItem('email');
    setEmail(null);
  };

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
    if (unlockedAchievements.some(a => a.id === achievement.id)) return;
    setUnlockedAchievements(prev => [...prev, achievement]);
    showNotification(`Conquista: ${achievement.name}`);
  };

  return (
    <GameContext.Provider value={{
      level, xp, xpToNextLevel, unlockedAchievements, notification, isInitialLoad,
      addXp, unlockAchievement, loginUser, logoutUser
    }}>
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
  notification: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.8)', padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  notificationText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame deve ser usado dentro do GameProvider');
  return context;
};