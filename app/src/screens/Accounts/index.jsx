import React from 'react';
import { FlatList, Text, View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const mockData = [
  {
    id: '1',
    nome: 'Energia Elétrica',
    valor: 120.75,
    data: '2025-06-01',
    vencimento: '2025-06-10',
    tipoGasto: 'fixo',
    formaPagamento: 'à vista',
    localidade: 'Residência',
    coordenadas: { latitude: -23.55052, longitude: -46.633308 }, // São Paulo
  },
  {
    id: '2',
    nome: 'Internet',
    valor: 89.99,
    data: '2025-06-01',
    vencimento: '2025-06-15',
    tipoGasto: 'fixo',
    formaPagamento: 'à vista',
    localidade: 'Residência',
    coordenadas: { latitude: -22.9068, longitude: -43.1729 }, // Rio de Janeiro
  },
  {
    id: '3',
    nome: 'Compra Mercado',
    valor: 230.5,
    data: '2025-06-05',
    vencimento: '2025-06-05',
    tipoGasto: 'único',
    formaPagamento: 'parcelado',
    localidade: 'Supermercado XYZ',
    coordenadas: { latitude: -25.4284, longitude: -49.2733 }, // Curitiba
  },
];

export function Accounts() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contas</Text>

      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.value}>R$ {item.valor.toFixed(2)}</Text>
            <Text style={styles.info}>Tipo: {item.tipoGasto} | {item.formaPagamento}</Text>
            <Text style={styles.info}>Data: {item.data}</Text>
            <Text style={styles.info}>Vencimento: {item.vencimento}</Text>
            <Text style={styles.info}>Local: {item.localidade}</Text>

            <MapView
              style={styles.map}
              initialRegion={{
                ...item.coordenadas,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={item.coordenadas} />
            </MapView>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  value: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '600',
    marginVertical: 4,
  },
  info: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  map: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
});