import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const AccountModal = ({ 
  visible, 
  onClose, 
  formData, 
  onInputChange, 
  onSubmit, 
  isSubmitting 
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Adicionar Nova Conta</Text>
        
        {/* Campos do formulário */}
        <TextInput
          style={styles.input}
          placeholder="Nome da conta"
          value={formData.nome}
          onChangeText={(text) => onInputChange('nome', text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Valor total"
          keyboardType="numeric"
          value={formData.valorTotal}
          onChangeText={(text) => onInputChange('valorTotal', text)}
        />
        
        <Picker
          selectedValue={formData.tipoGasto}
          onValueChange={(itemValue) => onInputChange('tipoGasto', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Fixo" value="fixo" />
          <Picker.Item label="Variável" value="variável" />
          <Picker.Item label="Ocasional" value="ocasional" />
        </Picker>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={onSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  picker: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});