import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAccounts } from '../../contexts/AccountsContext';
import { ActivityIndicator } from 'react-native-paper';
import { GameStatus } from '../../components/GameStatus';
import { useTheme } from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export function Home() {
  const [chartData, setChartData] = useState([]);
  const { accounts, loading, fetchAccounts } = useAccounts();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const themeColors = {
    background: isDark ? '#111827' : '#f9fafb',
    text: isDark ? '#f9fafb' : '#111827',
    card: isDark ? '#1f2937' : '#ffffff',
    label: isDark ? '#93c5fd' : '#2563eb',
    border: isDark ? '#374151' : '#ddd',
  };

  // 🔁 Garante que os dados são atualizados sempre que a tela for exibida
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const email = await AsyncStorage.getItem('email');
        if (email) {
          await fetchAccounts(email);
        }
      };
      fetchData();
    }, [])
  );

  // 🎯 Atualiza os dados do gráfico sempre que mudar contas ou loading
  useEffect(() => {
    if (!loading && accounts.length > 0) {
      const contasPagar = accounts.filter((c) => c.status === 0).length;
      const contasAtrasadas = accounts.filter((c) => c.status === 1).length;
      const contasPagas = accounts.filter((c) => c.status === 2).length;

      setChartData([
        {
          name: 'Pagar',
          population: contasPagar,
          color: '#facc15',
          legendFontColor: themeColors.text,
          legendFontSize: 14,
        },
        {
          name: 'Atrasadas',
          population: contasAtrasadas,
          color: '#f43f5e',
          legendFontColor: themeColors.text,
          legendFontSize: 14,
        },
        {
          name: 'Pagas',
          population: contasPagas,
          color: '#3b82f6',
          legendFontColor: themeColors.text,
          legendFontSize: 14,
        },
      ]);
    } else {
      setChartData([]); // limpa gráfico se não há contas
    }
  }, [accounts, loading]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.label} />
        <Text style={{ marginTop: 10, color: themeColors.text }}>Carregando contas...</Text>
      </View>
    );
  }

  const contasPagar = accounts.filter((c) => c.status === 0).length;
  const contasAtrasadas = accounts.filter((c) => c.status === 1).length;
  const contasPagas = accounts.filter((c) => c.status === 2).length;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <GameStatus />
        <View style={styles.content}>
          <Text style={[styles.title, { color: themeColors.label }]}>Resumo geral</Text>

          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={Dimensions.get('window').width - 60}
              height={200}
              chartConfig={{ color: () => themeColors.text }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="20"
              center={[5, 0]}
              absolute
              style={styles.chart}
            />
          ) : (
            <Text style={{ color: themeColors.text, marginBottom: 30 }}>
              Nenhuma conta para exibir no gráfico.
            </Text>
          )}

          <View style={styles.boxContainer}>
            <View style={[styles.card, styles.cardPagar, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.label, { color: themeColors.label }]}>Pagar</Text>
              <Text style={[styles.value, { color: themeColors.text }]}>{contasPagar}</Text>
            </View>

            <View style={[styles.card, styles.cardAtrasadas, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.label, { color: themeColors.label }]}>Atrasadas</Text>
              <Text style={[styles.value, { color: themeColors.text }]}>{contasAtrasadas}</Text>
            </View>

            <View style={[styles.card, styles.cardPagas, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.label, { color: themeColors.label }]}>Pagas</Text>
              <Text style={[styles.value, { color: themeColors.text }]}>{contasPagas}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 15,
  },
  chart: {
    marginBottom: 30,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cardPagar: {
    borderBottomWidth: 4,
    borderBottomColor: '#facc15',
  },
  cardAtrasadas: {
    borderBottomWidth: 4,
    borderBottomColor: '#f43f5e',
  },
  cardPagas: {
    borderBottomWidth: 4,
    borderBottomColor: '#3b82f6',
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});