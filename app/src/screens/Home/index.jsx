import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import api from '../../services/api';
import { useAccounts } from '../../contexts/AccountsContext';
import { ActivityIndicator } from 'react-native-paper';
import { GameStatus } from '../../components/GameStatus';

export function Home() {
  const [contas, setContas] = useState([]);
  const { accounts, loading } = useAccounts();

  useEffect(() => {
    api.get('/accounts')
      .then((res) => setContas(res.data))
      .catch((err) => console.error('Erro ao buscar contas:', err));
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Carregando contas...</Text>
      </View>
    );
  }

  const contasPagar = accounts.filter((c) => c.status === 0).length;
  const contasAtrasadas = accounts.filter((c) => c.status === 1).length;
  const contasPagas = accounts.filter((c) => c.status === 2).length;

  const chartData = [
    {
      name: 'Pagar',
      population: contasPagar,
      color: '#facc15',
      legendFontColor: '#555',
      legendFontSize: 14,
    },
    {
      name: 'Atrasadas',
      population: contasAtrasadas,
      color: '#f43f5e',
      legendFontColor: '#555',
      legendFontSize: 14,
    },
    {
      name: 'Pagas',
      population: contasPagas,
      color: '#3b82f6',
      legendFontColor: '#555',
      legendFontSize: 14,
    },
  ];

  return (
    <><GameStatus />
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Resumo geral</Text>

        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 60}
          height={200}
          chartConfig={{ color: () => '#000' }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="20"
          center={[5, 0]}
          absolute
          style={styles.chart} />

        <View style={styles.boxContainer}>
          <View style={[styles.card, styles.cardPagar]}>
            <Text style={styles.label}>Pagar</Text>
            <Text style={styles.value}>{contasPagar}</Text>
          </View>
          <View style={[styles.card, styles.cardAtrasadas]}>
            <Text style={styles.label}>Atrasadas</Text>
            <Text style={styles.value}>{contasAtrasadas}</Text>
          </View>
          <View style={[styles.card, styles.cardPagas]}>
            <Text style={styles.label}>Pagas</Text>
            <Text style={styles.value}>{contasPagas}</Text>
          </View>
        </View>
      </View>
    </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  center: {
    justifyContent: 'center',
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
    color: '#2563eb',
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
    backgroundColor: '#fff',
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
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  container_game: {

  },
});
