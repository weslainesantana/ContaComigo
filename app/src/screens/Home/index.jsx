// components/Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import  api  from '../../services/api';
import { useAccounts } from '../../contexts/AccountsContext';
import { ActivityIndicator } from 'react-native-paper';

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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
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
      color: '#FFCE56',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Atrasadas',
      population: contasAtrasadas,
      color: '#FF6384',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Pagas',
      population: contasPagas,
      color: '#36A2EB',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo geral</Text>

      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={180}
        chartConfig={{ color: () => '#000' }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />

      <View style={styles.boxContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>Pagar</Text>
          <Text style={styles.value}>{contasPagar}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Atrasadas</Text>
          <Text style={styles.value}>{contasAtrasadas}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Pagas</Text>
          <Text style={styles.value}>{contasPagas}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    minWidth: 80,
  },
  label: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});