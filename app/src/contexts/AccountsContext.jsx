// contexts/AccountsContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Definindo constantes para os status (recomendado para evitar "magic numbers")
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

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/accounts');
      setAccounts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar contas:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (accountData) => {
    try {
      setLoading(true);
      const response = await api.post('/accounts', accountData);
      setAccounts(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao adicionar conta:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função corrigida para marcar conta como paga
  const markAccountAsPaid = async (accountId) => {
    try {
      setLoading(true);
      const response = await api.patch(`/accounts/${accountId}`, { 
        status: STATUS.PAID,
        dataPagamento: new Date().toISOString().split('T')[0]
      });
      
      // Atualiza o estado local imediatamente para melhor UX
      setAccounts(prev => prev.map(account => 
        account.id === accountId ? {
          ...account,
          status: STATUS.PAID,
          dataPagamento: new Date().toISOString().split('T')[0]
        } : account
      ));
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao marcar conta como paga:', err);
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
        markAccountAsPaid
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