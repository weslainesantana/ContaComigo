import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext"; // importa do seu context

export default function Onboarding() {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const backgroundColor = isDark ? "#111827" : "#f9fafb";
  const titleColor = isDark ? "#f3f4f6" : "#222";
  const subtitleColor = isDark ? "#9ca3af" : "#666";
  const buttonCreateBorder = "#1e66fd";

  return (
    <View style={[styles.container, { backgroundColor }]}>
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

      <Text style={styles.emoji}>👋</Text>

      <Text variant="headlineLarge" style={[styles.title, { color: titleColor }]}>
        Bem-vindo ao <Text style={styles.titleBlue}>ContaComigo</Text>
      </Text>

      <Text variant="bodyMedium" style={[styles.subtitle, { color: subtitleColor }]}>
        Seu app de suporte e acompanhamento personalizado.
      </Text>

      <Button
        mode="outlined"
        onPress={() => navigation.replace("TelaLogin")}
        style={[styles.button_enter, { backgroundColor: "#1e66fd", borderColor: "#1e66fd" }]}
        labelStyle={styles.label_enter}
        contentStyle={{ flexDirection: "row-reverse" }}
      >
        Entrar
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.replace("TelaCadastro")}
        style={[styles.button_create, { borderColor: buttonCreateBorder }]}
        labelStyle={[styles.buttonLabel, { color: buttonCreateBorder }]}
        contentStyle={{ flexDirection: "row-reverse" }}
      >
        Criar Conta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button_enter: {
    width: "60%",
    borderRadius: 25,
    borderWidth: 1.5,
    marginTop: 16,
  },
  button_create: {
    width: "60%",
    borderRadius: 25,
    borderWidth: 1.5,
    marginTop: 16,
  },
  label_enter: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonLabel: {
    fontWeight: "bold",
  },
  titleBlue: {
    color: "#1e66fd",
    fontWeight: "bold",
  },
});
