import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useGamifiedAccounts } from '../../contexts/useGamifiedAccounts';
import { GameStatus } from '../../components/GameStatus';

export function Accounts() {
  const { 
    accounts, 
    loading, 
    fetchAccounts, 
    addAccount, 
    markAccountAsPaid,
    updateAccount,
    deleteAccount
  } = useGamifiedAccounts();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  
  const [currentAccount, setCurrentAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    data: '',
    vencimento: '',
    tipoGasto: 'fixo',
    formaPagamento: 'à vista',
    localidade: '',
    coordenadas: null,
    status: 0,
    qtdParcela: 1,
    valorTotal: '',
    parcelas: {}
  });
  
  const [showMap, setShowMap] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showVencimentoPicker, setShowVencimentoPicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openDatePicker = (field) => {
    setCurrentDateField(field);
    field === 'data' ? setShowDatePicker(true) : setShowVencimentoPicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowVencimentoPicker(false);
    }

    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setFormData({
        ...formData,
        [currentDateField]: formattedDate
      });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });

    // Cálculo automático das parcelas
    if (name === 'qtdParcela' && formData.formaPagamento === 'parcelado') {
      const total = parseFloat(formData.valorTotal) || 0;
      const parcelas = parseInt(value) || 1;
      const valorParcela = (total / parcelas).toFixed(2);

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
    setIsSubmitting(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [year, month, day] = formData.vencimento.split('-').map(Number);
      const dueDate = new Date(year, month - 1, day);
      dueDate.setHours(0, 0, 0, 0);

      const status = today > dueDate ? 1 : 0;

      const result = await addAccount({
        ...formData,
        status: status
      });

      if (result.success) {
        setModalVisible(false);
        Alert.alert('Sucesso', 'Conta adicionada com sucesso!');
        resetForm();
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar a conta');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAccount = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateAccount(currentAccount.id, formData);
      
      if (result.success) {
        setEditModalVisible(false);
        Alert.alert('Sucesso', 'Conta atualizada com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a conta');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (accountId) => {
    try {
      const result = await markAccountAsPaid(accountId);

      if (result.success) {
        Alert.alert('Sucesso', 'Conta marcada como paga!');
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível marcar a conta como paga');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação');
    }
  };

  const confirmDelete = async () => {
    const result = await deleteAccount(accountToDelete);
    
    if (result.success) {
      Alert.alert('Sucesso', 'Conta removida com sucesso!');
    } else {
      Alert.alert('Erro', result.error || 'Não foi possível remover a conta');
    }
    
    setDeleteConfirmVisible(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      valor: '',
      data: '',
      vencimento: '',
      tipoGasto: 'fixo',
      formaPagamento: 'à vista',
      localidade: '',
      coordenadas: null,
      status: 0,
      qtdParcela: 1,
      valorTotal: '',
      parcelas: {}
    });
  };

  const handleEdit = (account) => {
    setCurrentAccount(account);
    setFormData({
      nome: account.nome,
      valor: account.valor,
      data: account.data,
      vencimento: account.vencimento,
      tipoGasto: account.tipoGasto,
      formaPagamento: account.formaPagamento,
      localidade: account.localidade,
      coordenadas: account.coordenadas,
      status: account.status,
      qtdParcela: account.qtdParcela,
      valorTotal: account.valorTotal,
      parcelas: account.parcelas || {}
    });
    setEditModalVisible(true);
  };

  const getAccountStatus = (account) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (account.status === 2) {
      return { status: 'Paga', color: '#10b981' };
    }

    if (!account.vencimento || typeof account.vencimento !== 'string') {
      return { status: 'Data inválida', color: '#ef4444' };
    }

    let dueDate;
    try {
      const [year, month, day] = account.vencimento.split('-').map(Number);
      dueDate = new Date(year, month - 1, day);
      dueDate.setHours(0, 0, 0, 0);
    } catch (e) {
      return { status: 'Data inválida', color: '#ef4444' };
    }

    if (account.status === 1) {
      return { status: 'Atrasada', color: '#ef4444' };
    } else if (today > dueDate) {
      return { status: 'Atrasada', color: '#ef4444' };
    } else {
      return { status: 'A pagar', color: '#3b82f6' };
    }
  };

  if (loading && !modalVisible && !editModalVisible) {
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
        renderItem={({ item }) => {
          const statusInfo = getAccountStatus(item);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.nome}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                  <Text style={styles.statusText}>{statusInfo.status}</Text>
                </View>
              </View>
              <Text style={styles.value}>R$ {parseFloat(item.valorTotal).toFixed(2)}</Text>
              <Text style={styles.info}>Tipo: {item.tipoGasto} | {item.formaPagamento}</Text>
              {item.qtdParcela > 1 ? (
                <Text style={styles.info}>
                  Parcelado em {item.qtdParcela}x de R$ {(parseFloat(item.valorTotal) / item.qtdParcela).toFixed(2)}
                </Text>
              ) : (
                <Text style={styles.info}>
                  Pagamento à vista
                </Text>
              )}
              <Text style={styles.info}>Data: {item.data}</Text>
              <Text style={styles.info}>Vencimento: {item.vencimento}</Text>

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

              <View style={styles.cardActions}>
                {item.status !== 2 && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    setAccountToDelete(item.id);
                    setDeleteConfirmVisible(true);
                  }}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>

              {item.status !== 2 && (
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => handleMarkAsPaid(item.id)}
                >
                  <Text style={styles.payButtonText}>Marcar como paga</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal de Adição */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Nova Conta</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Conta</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleInputChange('nome', text)}
              placeholder="Ex: Aluguel, Luz, Internet"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor Total</Text>
            <TextInput
              style={styles.input}
              value={formData.valorTotal}
              onChangeText={(text) => handleInputChange('valorTotal', text)}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity onPress={() => openDatePicker('data')}>
              <TextInput
                style={styles.input}
                value={formData.data}
                placeholder="YYYY-MM-DD"
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.data ? new Date(formData.data) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Vencimento</Text>
            <TouchableOpacity onPress={() => openDatePicker('vencimento')}>
              <TextInput
                style={styles.input}
                value={formData.vencimento}
                placeholder="YYYY-MM-DD"
                editable={false}
              />
            </TouchableOpacity>
            {showVencimentoPicker && (
              <DateTimePicker
                value={formData.vencimento ? new Date(formData.vencimento) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Gasto</Text>
            <Picker
              selectedValue={formData.tipoGasto}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('tipoGasto', itemValue)}
            >
              <Picker.Item label="Fixo" value="fixo" />
              <Picker.Item label="Variável" value="variável" />
              <Picker.Item label="Ocasional" value="ocasional" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Forma de Pagamento</Text>
            <Picker
              selectedValue={formData.formaPagamento}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('formaPagamento', itemValue)}
            >
              <Picker.Item label="À vista" value="à vista" />
              <Picker.Item label="Parcelado" value="parcelado" />
            </Picker>
          </View>

          {formData.formaPagamento === 'parcelado' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantidade de Parcelas</Text>
              <TextInput
                style={styles.input}
                value={formData.qtdParcela.toString()}
                onChangeText={(text) => handleInputChange('qtdParcela', text)}
                placeholder="Número de parcelas"
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Localidade</Text>
            <TextInput
              style={styles.input}
              value={formData.localidade}
              onChangeText={(text) => handleInputChange('localidade', text)}
              placeholder="Onde foi realizado o gasto?"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Localização (opcional)</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={formData.coordenadas ? `${formData.coordenadas.latitude.toFixed(4)}, ${formData.coordenadas.longitude.toFixed(4)}` : ''}
                placeholder="Selecione no mapa"
                editable={false}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleLocationSelect}
              >
                <Text style={styles.locationButtonText}>🗺️</Text>
              </TouchableOpacity>
            </View>
            {formData.coordenadas && (
              <Text style={styles.coordsText}>
                Lat: {formData.coordenadas.latitude.toFixed(4)}, Long: {formData.coordenadas.longitude.toFixed(4)}
              </Text>
            )}
          </View>

          {showMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.mapPicker}
                initialRegion={{
                  latitude: formData.coordenadas?.latitude || -23.5505,
                  longitude: formData.coordenadas?.longitude || -46.6333,
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
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Conta</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Conta</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleInputChange('nome', text)}
              placeholder="Ex: Aluguel, Luz, Internet"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor Total</Text>
            <TextInput
              style={styles.input}
              value={formData.valorTotal}
              onChangeText={(text) => handleInputChange('valorTotal', text)}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity onPress={() => openDatePicker('data')}>
              <TextInput
                style={styles.input}
                value={formData.data}
                placeholder="YYYY-MM-DD"
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.data ? new Date(formData.data) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Vencimento</Text>
            <TouchableOpacity onPress={() => openDatePicker('vencimento')}>
              <TextInput
                style={styles.input}
                value={formData.vencimento}
                placeholder="YYYY-MM-DD"
                editable={false}
              />
            </TouchableOpacity>
            {showVencimentoPicker && (
              <DateTimePicker
                value={formData.vencimento ? new Date(formData.vencimento) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Gasto</Text>
            <Picker
              selectedValue={formData.tipoGasto}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('tipoGasto', itemValue)}
            >
              <Picker.Item label="Fixo" value="fixo" />
              <Picker.Item label="Variável" value="variável" />
              <Picker.Item label="Ocasional" value="ocasional" />
            </Picker>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Forma de Pagamento</Text>
            <Picker
              selectedValue={formData.formaPagamento}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('formaPagamento', itemValue)}
            >
              <Picker.Item label="À vista" value="à vista" />
              <Picker.Item label="Parcelado" value="parcelado" />
            </Picker>
          </View>

          {formData.formaPagamento === 'parcelado' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantidade de Parcelas</Text>
              <TextInput
                style={styles.input}
                value={formData.qtdParcela.toString()}
                onChangeText={(text) => handleInputChange('qtdParcela', text)}
                placeholder="Número de parcelas"
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Localidade</Text>
            <TextInput
              style={styles.input}
              value={formData.localidade}
              onChangeText={(text) => handleInputChange('localidade', text)}
              placeholder="Onde foi realizado o gasto?"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Localização (opcional)</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={formData.coordenadas ? `${formData.coordenadas.latitude.toFixed(4)}, ${formData.coordenadas.longitude.toFixed(4)}` : ''}
                placeholder="Selecione no mapa"
                editable={false}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleLocationSelect}
              >
                <Text style={styles.locationButtonText}>🗺️</Text>
              </TouchableOpacity>
            </View>
            {formData.coordenadas && (
              <Text style={styles.coordsText}>
                Lat: {formData.coordenadas.latitude.toFixed(4)}, Long: {formData.coordenadas.longitude.toFixed(4)}
              </Text>
            )}
          </View>

          {showMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.mapPicker}
                initialRegion={{
                  latitude: formData.coordenadas?.latitude || -23.5505,
                  longitude: formData.coordenadas?.longitude || -46.6333,
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
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleUpdateAccount}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteConfirmVisible}
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir esta conta?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteConfirmVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    justifyContent: 'center',
    minHeight: 40,
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
    backgroundColor: '#262c36',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  payButton: {
    marginTop: 10,
    backgroundColor: '#10b981',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});