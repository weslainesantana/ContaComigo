// src/components/EditModal.js
import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export const EditModal = ({ 
  visible,
  onClose,
  formData,
  onInputChange,
  onDateChange,
  onSubmit,
  isSubmitting,
  showDatePicker,
  showVencimentoPicker
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Editar Conta</Text>
        
        {/* Nome da Conta */}
        <Text style={styles.label}>Nome da Conta</Text>
        <TextInput
          style={styles.input}
          value={formData.nome}
          onChangeText={(text) => onInputChange('nome', text)}
          placeholder="Ex: Aluguel, Luz, Internet"
        />
        
        {/* Valor Total */}
        <Text style={styles.label}>Valor Total</Text>
        <TextInput
          style={styles.input}
          value={formData.valorTotal}
          onChangeText={(text) => onInputChange('valorTotal', text)}
          placeholder="R$ 0,00"
          keyboardType="numeric"
        />
        
        {/* Data de Vencimento */}
        <Text style={styles.label}>Data de Vencimento</Text>
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => onDateChange('vencimento')}
        >
          <Text>{formData.vencimento || 'Selecione a data'}</Text>
        </TouchableOpacity>
        {showVencimentoPicker && (
          <DateTimePicker
            value={formData.vencimento ? new Date(formData.vencimento) : new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              if (date) {
                onInputChange('vencimento', date.toISOString().split('T')[0]);
              }
            }}
          />
        )}
        
        {/* Tipo de Gasto */}
        <Text style={styles.label}>Tipo de Gasto</Text>
        <Picker
          selectedValue={formData.tipoGasto}
          onValueChange={(itemValue) => onInputChange('tipoGasto', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Fixo" value="fixo" />
          <Picker.Item label="Variável" value="variável" />
          <Picker.Item label="Ocasional" value="ocasional" />
        </Picker>
        
        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    justifyContent: 'center',
    height: 40,
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});