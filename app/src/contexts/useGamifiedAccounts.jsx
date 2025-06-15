import { useAccounts } from './AccountsContext';
import { useGame } from './GameContext';
import { XP_EVENTS, ACHIEVEMENTS } from './GameContext';

export const useGamifiedAccounts = () => {
  const accounts = useAccounts();
  const game = useGame();

  const enhancedMarkAsPaid = async (accountId) => {
    try {
      const result = await accounts.markAccountAsPaid(accountId);
      
      if (result.success) {
        const account = accounts.accounts.find(a => a.id === accountId);
        
        if (account) {
          const paymentDate = new Date(account.dataPagamento);
          const dueDate = new Date(account.vencimento);
          const daysBeforeDue = Math.floor((dueDate - paymentDate) / (1000 * 60 * 60 * 24));
          
          // Adicionar XP baseado no tempo de pagamento
          if (daysBeforeDue >= 5) {
            game.addXp(XP_EVENTS.PAY_EARLY);
            game.unlockAchievement(ACHIEVEMENTS.EARLY_BIRD);
          } else if (daysBeforeDue >= 0) {
            game.addXp(XP_EVENTS.PAY_ON_TIME);
          }
          
          // Verificar conquista de primeiro pagamento
          const paidCount = accounts.accounts.filter(a => a.status === 2).length;
          if (paidCount === 1) {
            game.unlockAchievement(ACHIEVEMENTS.FIRST_BLOOD);
          }
          
          // Verificar sequência de pagamentos em dia
          checkOnTimeStreak();
        }
      }
      
      return result;
    } catch (error) {
      console.error('Erro no pagamento gamificado:', error);
      return { success: false, error: error.message };
    }
  };

  // Verificar sequência de pagamentos em dia
  const checkOnTimeStreak = () => {
    const paidAccounts = accounts.accounts
      .filter(a => a.status === 2)
      .sort((a, b) => new Date(b.dataPagamento) - new Date(a.dataPagamento));
    
    let streak = 0;
    for (const account of paidAccounts) {
      const paymentDate = new Date(account.dataPagamento);
      const dueDate = new Date(account.vencimento);
      
      if (paymentDate <= dueDate) {
        streak++;
      } else {
        break;
      }
    }
    
    if (streak >= 3) {
      game.unlockAchievement(ACHIEVEMENTS.ON_TIME_STREAK_3);
    }
    
    if (streak >= 10) {
      game.unlockAchievement(ACHIEVEMENTS.ON_TIME_STREAK_10);
    }
  };

  // Sobrescrever a função addAccount com gamificação
  const enhancedAddAccount = async (accountData) => {
    const result = await accounts.addAccount(accountData);
    
    if (result.success) {
      game.addXp(XP_EVENTS.ADD_ACCOUNT);
      
      // Verificar conquista de gerenciamento de contas
      if (accounts.accounts.length >= 10) {
        game.unlockAchievement(ACHIEVEMENTS.ACCOUNT_MANAGER);
      }
    }
    
    return result;
  };

  // Sobrescrever a função deleteAccount com gamificação
  const enhancedDeleteAccount = async (accountId) => {
    const result = await accounts.deleteAccount(accountId);
    
    if (result.success) {
      game.addXp(XP_EVENTS.DELETE_ACCOUNT);
    }
    
    return result;
  };

  return {
    // Todas as propriedades originais de accounts
    ...accounts,
    
    // Propriedades do game
    ...game,
    
    // Métodos sobrescritos com gamificação
    markAccountAsPaid: enhancedMarkAsPaid,
    addAccount: enhancedAddAccount,
    deleteAccount: enhancedDeleteAccount,
    
    // Métodos adicionais
    checkOnTimeStreak,
    
    // Dados combinados
    gamifiedAccounts: accounts.accounts.map(account => {
      const status = getAccountStatus(account);
      return {
        ...account,
        statusInfo: status
      };
    })
  };
};

// Helper para obter status da conta
const getAccountStatus = (account) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (account.status === 2) {
    return { status: 'Paga', color: '#10b981' };
  }

  if (!account.vencimento) {
    return { status: 'Sem vencimento', color: '#6b7280' };
  }

  const dueDate = new Date(account.vencimento);
  dueDate.setHours(0, 0, 0, 0);

  if (account.status === 1) {
    return { status: 'Atrasada', color: '#ef4444' };
  } else if (today > dueDate) {
    return { status: 'Atrasada', color: '#ef4444' };
  } else {
    return { status: 'A pagar', color: '#3b82f6' };
  }
};