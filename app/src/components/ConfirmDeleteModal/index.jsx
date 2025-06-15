import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const ConfirmDeleteModal = ({ 
  visible, 
  onCancel, 
  onConfirm 
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <MaterialIcons 
            name="warning" 
            size={40} 
            color="#f59e0b" 
            style={styles.warningIcon}
          />
          <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
          <Text style={styles.modalText}>
            Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
          </Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1f2937',
  },
  modalText: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4b5563',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});