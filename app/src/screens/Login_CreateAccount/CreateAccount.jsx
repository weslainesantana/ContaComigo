import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../../services/api';
import { useTheme, toggleTheme } from '../../contexts/ThemeContext';

export default function TelaCadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmaSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    setLoading(true);
    
    try {
      await api.post('/users', { nome, email, senha });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('TelaLogin');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      let errorMessage = 'Erro ao realizar cadastro';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const backgroundColor = isDark ? '#111827' : '#f9fafb';
  const inputBackground = isDark ? '#1f2937' : '#fff';
  const textColor = isDark ? '#f3f4f6' : '#111';
  const placeholderColor = isDark ? '#9ca3af' : '#888';
  const footerTextColor = isDark ? '#d1d5db' : '#555';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor }]}
    >
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: 'absolute',
          top: 45,
          right: 20,
          padding: 8,
          zIndex: 10,
        }}
      >
        <Text style={{ fontSize: 22 }}>
          {isDark ? '☀️' : '🌙'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: '#2563eb' }]}>Criar conta</Text>

      <TextInput
        style={[styles.input, {
          backgroundColor: inputBackground,
          color: textColor,
          borderColor: isDark ? '#374151' : '#ddd',
        }]}
        placeholder="Nome completo"
        placeholderTextColor={placeholderColor}
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        autoCorrect={false}
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: inputBackground,
          color: textColor,
          borderColor: isDark ? '#374151' : '#ddd',
        }]}
        placeholder="E-mail"
        placeholderTextColor={placeholderColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: inputBackground,
          color: textColor,
          borderColor: isDark ? '#374151' : '#ddd',
        }]}
        placeholder="Senha"
        placeholderTextColor={placeholderColor}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TextInput
        style={[styles.input, {
          backgroundColor: inputBackground,
          color: textColor,
          borderColor: isDark ? '#374151' : '#ddd',
        }]}
        placeholder="Confirmar senha"
        placeholderTextColor={placeholderColor}
        value={confirmaSenha}
        onChangeText={setConfirmaSenha}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCadastro} 
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: footerTextColor }]}>Já tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("TelaLogin")}>
          <Text style={styles.footerLink}>Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2563eb',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    color: '#2563eb',
    fontWeight: '700',
  },
});