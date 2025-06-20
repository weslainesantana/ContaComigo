import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useGame, XP_EVENTS, ACHIEVEMENTS } from './GameContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const STATUS = {
  PENDING: 0,    // A pagar
  OVERDUE: 1,    // Atrasada
  PAID: 2        // Paga
};

const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addXp, unlockAchievement } = useGame();

  const fetchAccounts = async (email) => {
    try {
      setLoading(true);
      const response = await api.get('/accounts');
      // Filtrar contas pelo email do usuário
      const filteredAccounts = response.data.filter(account => account.email === email);
      setAccounts(filteredAccounts);
      setError(null);
      
      checkAchievements(filteredAccounts);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar contas:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = (accountsList) => {
    const paidAccounts = accountsList.filter(a => a.status === STATUS.PAID);
    
    // Verificar primeiro pagamento
    if (paidAccounts.length >= 1) {
      unlockAchievement(ACHIEVEMENTS.FIRST_BLOOD);
    }
    
    // Verificar conquista de adicionar contas
    if (accountsList.length >= 10) {
      unlockAchievement(ACHIEVEMENTS.ACCOUNT_MANAGER);
    }
    
    // Verificar sequência de pagamentos em dia
    checkOnTimeStreak(paidAccounts);
    
    // Verificar pagamento antecipado
    const earlyPayments = paidAccounts.filter(account => {
      if (!account.dataPagamento || !account.vencimento) return false;
      
      const paymentDate = new Date(account.dataPagamento);
      const dueDate = new Date(account.vencimento);
      const daysBefore = (dueDate - paymentDate) / (1000 * 60 * 60 * 24);
      
      return daysBefore >= 5;
    });
    
    if (earlyPayments.length > 0) {
      unlockAchievement(ACHIEVEMENTS.EARLY_BIRD);
    }
  };

  const checkOnTimeStreak = (paidAccounts) => {
    const sortedAccounts = [...paidAccounts]
      .sort((a, b) => new Date(b.dataPagamento) - new Date(a.dataPagamento));
    
    let streak = 0;
    for (const account of sortedAccounts) {
      if (!account.dataPagamento || !account.vencimento) continue;
      
      const paymentDate = new Date(account.dataPagamento);
      const dueDate = new Date(account.vencimento);
      
      if (paymentDate <= dueDate) {
        streak++;
      } else {
        break;
      }
    }
    
    if (streak >= 3) {
      unlockAchievement(ACHIEVEMENTS.ON_TIME_STREAK_3);
    }
    
    if (streak >= 10) {
      unlockAchievement(ACHIEVEMENTS.ON_TIME_STREAK_10);
    }
  };

  const addAccount = async (accountData) => {
    try {
      setLoading(true);
      const email = await AsyncStorage.getItem('email');
      const accountWithEmail = {
        ...accountData,
        email: email // Adiciona o email ao objeto da conta
      };
      
      const response = await api.post('/accounts', accountWithEmail);
      setAccounts(prev => [...prev, response.data]);
      
      addXp(XP_EVENTS.ADD_ACCOUNT);
      
      if (accounts.length + 1 >= 10) {
        unlockAchievement(ACHIEVEMENTS.ACCOUNT_MANAGER);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao adicionar conta:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const markAccountAsPaid = async (accountId) => {
    try {
      setLoading(true);
      const account = accounts.find(a => a.id === accountId);
      
      if (!account) {
        throw new Error('Conta não encontrada');
      }
      
      // Verificar se está pagando antecipado
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(account.vencimento);
      dueDate.setHours(0, 0, 0, 0);
      
      const daysBeforeDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
      
      // Gamificação - XP baseado no tempo de pagamento
      if (daysBeforeDue >= 5) {
        addXp(XP_EVENTS.PAY_EARLY);
        unlockAchievement(ACHIEVEMENTS.EARLY_BIRD);
      } else if (daysBeforeDue >= 0) {
        addXp(XP_EVENTS.PAY_ON_TIME);
      }
      
      // Verificar conquista de primeiro pagamento
      const paidAccounts = accounts.filter(a => a.status === STATUS.PAID).length;
      if (paidAccounts === 0) {
        unlockAchievement(ACHIEVEMENTS.FIRST_BLOOD);
      }
      
      const response = await api.patch(`/accounts/${accountId}`, { 
        status: STATUS.PAID,
        dataPagamento: new Date().toISOString().split('T')[0]
      });
      
      // Atualizar lista de contas
      const updatedAccounts = accounts.map(acc => 
        acc.id === accountId ? { 
          ...acc, 
          status: STATUS.PAID,
          dataPagamento: new Date().toISOString().split('T')[0]
        } : acc
      );
      
      setAccounts(updatedAccounts);
      
      // Verificar outras conquistas após pagamento
      checkOnTimeStreak(updatedAccounts.filter(a => a.status === STATUS.PAID));
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao marcar conta como paga:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (accountId, updatedData) => {
    try {
      setLoading(true);
      const response = await api.put(`/accounts/${accountId}`, updatedData);
      
      setAccounts(prev => prev.map(account => 
        account.id === accountId ? { ...account, ...updatedData } : account
      ));
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao atualizar conta:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      setLoading(true);
      await api.delete(`/accounts/${accountId}`);
      
      setAccounts(prev => prev.filter(account => account.id !== accountId));
      
      // Gamificação - Penalidade por deletar conta
      addXp(XP_EVENTS.DELETE_ACCOUNT);
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar conta:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <AccountsContext.Provider 
      value={{ 
        accounts, 
        loading, 
        error, 
        fetchAccounts, 
        addAccount,
        markAccountAsPaid,
        updateAccount,
        deleteAccount
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountsProvider');
  }
  return context;
};