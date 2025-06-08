import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from '../../services/api'; 
import { Picker } from '@react-native-picker/picker';

export function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    data: '',
    vencimento: '',
    tipoGasto: 'fixo',
    formaPagamento: 'à vista',
    localidade: '',
    coordenadas: null,
    status: 1,
    qtdParcela: 1,
    valorTotal: '',
    parcelas: {}
  });
  const [showMap, setShowMap] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Calcular valor da parcela se for parcelado
    if (name === 'qtdParcela' && formData.formaPagamento === 'parcelado') {
      const total = parseFloat(formData.valorTotal) || 0;
      const parcelas = parseInt(value) || 1;
      const valorParcela = (total / parcelas).toFixed(2);
      
      // Criar objeto de parcelas
      const novasParcelas = {};
      for (let i = 1; i <= parcelas; i++) {
        novasParcelas[`parcela${i}`] = {
          valor: valorParcela,
          data: formData.data,
          vencimento: formData.vencimento
        };
      }
      
      setFormData(prev => ({
        ...prev,
        parcelas: novasParcelas
      }));
    }
  };

  const handleLocationSelect = () => {
    setShowMap(true);
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setTempCoords({ latitude, longitude });
  };

  const confirmLocation = () => {
    setFormData({
      ...formData,
      coordenadas: tempCoords
    });
    setShowMap(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Preparar os dados conforme a estrutura do JSON
      const contaData = {
        ...formData,
        valor: parseFloat(formData.valor),
        valorTotal: parseFloat(formData.valorTotal),
        qtdParcela: formData.formaPagamento === 'parcelado' ? parseInt(formData.qtdParcela) : 1,
        status: 1 // Status padrão
      };
      
      await api.post('/accounts', contaData);
      await fetchAccounts();
      setModalVisible(false);
      Alert.alert('Sucesso', 'Conta adicionada com sucesso!');
      
      // Resetar form
      setFormData({
        nome: '',
        valor: '',
        data: '',
        vencimento: '',
        tipoGasto: 'fixo',
        formaPagamento: 'à vista',
        localidade: '',
        coordenadas: null,
        status: 1,
        qtdParcela: 1,
        valorTotal: '',
        parcelas: {}
      });
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a conta');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !modalVisible) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Carregando contas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.value}>R$ {parseFloat(item.valor).toFixed(2)}</Text>
            <Text style={styles.info}>Tipo: {item.tipoGasto} | {item.formaPagamento}</Text>
            <Text style={styles.info}>Data: {item.data}</Text>
            <Text style={styles.info}>Vencimento: {item.vencimento}</Text>
            <Text style={styles.info}>Local: {item.localidade}</Text>

            {item.coordenadas && item.coordenadas.latitude && (
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
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Nova Conta</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Gasto</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={[styles.radioButton, formData.tipoGasto === 'fixo' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('tipoGasto', 'fixo')}
              >
                <Text style={[styles.radioText, formData.tipoGasto === 'fixo' && styles.radioTextSelected]}>Fixo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.radioButton, formData.tipoGasto === 'variavel' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('tipoGasto', 'variavel')}
              >
                <Text style={[styles.radioText, formData.tipoGasto === 'variavel' && styles.radioTextSelected]}>Variável</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Localidade</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={formData.localidade}
                onChangeText={(text) => handleInputChange('localidade', text)}
                placeholder="Digite a localidade"
              />
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={handleLocationSelect}
              >
                <Text style={styles.locationButtonText}>📍</Text>
              </TouchableOpacity>
            </View>
            {formData.coordenadas && (
              <Text style={styles.coordsText}>
                Localização: {formData.coordenadas.latitude.toFixed(4)}, {formData.coordenadas.longitude.toFixed(4)}
              </Text>
            )}
          </View>

          {showMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.mapPicker}
                initialRegion={{
                  latitude: -23.5505,
                  longitude: -46.6333,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
              >
                {tempCoords && <Marker coordinate={tempCoords} />}
              </MapView>
              <View style={styles.mapButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowMap(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.submitButton]}
                  onPress={confirmLocation}
                  disabled={!tempCoords}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Pagamento</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity 
                style={[styles.radioButton, formData.formaPagamento === 'à vista' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('formaPagamento', 'à vista')}
              >
                <Text style={[styles.radioText, formData.formaPagamento === 'à vista' && styles.radioTextSelected]}>À vista</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.radioButton, formData.formaPagamento === 'parcelado' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('formaPagamento', 'parcelado')}
              >
                <Text style={[styles.radioText, formData.formaPagamento === 'parcelado' && styles.radioTextSelected]}>Parcelado</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Conta</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleInputChange('nome', text)}
              placeholder="Nome da conta"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              value={formData.valor}
              onChangeText={(text) => handleInputChange('valor', text)}
              placeholder="Valor"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              value={formData.data}
              onChangeText={(text) => handleInputChange('data', text)}
              placeholder="AAAA-MM-DD"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Vencimento</Text>
            <TextInput
              style={styles.input}
              value={formData.vencimento}
              onChangeText={(text) => handleInputChange('vencimento', text)}
              placeholder="AAAA-MM-DD"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor total</Text>
            <TextInput
              style={styles.input}
              value={formData.valorTotal}
              onChangeText={(text) => handleInputChange('valorTotal', text)}
              placeholder="Valor total"
              keyboardType="numeric"
            />
          </View>

          {formData.formaPagamento === 'parcelado' && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Número de parcelas</Text>
                <Picker
                selectedValue={formData.qtdParcela}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('qtdParcela', itemValue)}
                >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <Picker.Item key={num} label={`${num} parcela(s)`} value={num} />
                ))}
                </Picker>
              </View>

              {formData.qtdParcela > 1 && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Parcelas</Text>
                  {Object.entries(formData.parcelas).map(([key, parcela]) => (
                    <View key={key} style={styles.parcelaItem}>
                      <Text style={styles.parcelaText}>
                        {key}: R$ {parcela.valor} (Vencimento: {parcela.vencimento})
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setShowMap(false);
              }}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  locationButtonText: {
    fontSize: 20,
  },
  coordsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 5,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  radioButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#ebf4ff',
  },
  radioText: {
    fontSize: 14,
    color: '#555',
  },
  radioTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  mapContainer: {
    height: 300,
    marginVertical: 10,
  },
  mapPicker: {
    flex: 1,
    borderRadius: 8,
  },
  mapButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  parcelaItem: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 5,
  },
  parcelaText: {
    fontSize: 12,
    color: '#444',
  },
});