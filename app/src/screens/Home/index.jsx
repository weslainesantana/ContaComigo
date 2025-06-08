import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export function Home() {
  const contas = {
    pagar: 10,
    atrasadas: 10,
    pagas: 10,
  };

  const total = contas.pagar + contas.atrasadas + contas.pagas;

  const chartData = [
    {
      name: 'Pagar',
      population: contas.pagar,
      color: '#FFCE56',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Atrasadas',
      population: contas.atrasadas,
      color: '#FF6384',
      legendFontColor: '#000',
      legendFontSize: 12,
    },
    {
      name: 'Pagas',
      population: contas.pagas,
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
        chartConfig={{
          color: () => '#000',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />

      <View style={styles.boxContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>Pagar</Text>
          <Text style={styles.value}>{contas.pagar}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Atrasadas</Text>
          <Text style={styles.value}>{contas.atrasadas}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Pagas</Text>
          <Text style={styles.value}>{contas.pagas}</Text>
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
    color: '#2563eb', // Azul
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