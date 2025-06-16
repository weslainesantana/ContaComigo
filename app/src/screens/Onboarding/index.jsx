import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function Onboarding() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👋</Text>

      <Text variant="headlineLarge" style={styles.title}>
        Bem-vindo ao <Text style={styles.titleBlue}>ContaComigo</Text>
      </Text>


      <Text variant="bodyMedium" style={styles.subtitle}>
        Seu app de suporte e acompanhamento personalizado.
      </Text>

      <Button
        mode="outlined"
        onPress={() => navigation.replace("TelaLogin")}
        style={styles.button_enter}
        labelStyle={styles.label_enter}
        contentStyle={{ flexDirection: "row-reverse" }}
      >
        Entrar
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.replace("TelaCadastro")}
        style={styles.button_create}
        labelStyle={styles.buttonLabel}
        contentStyle={{ flexDirection: "row-reverse" }}
      >
        Criar Conta
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.replace("Main")}
        style={styles.button_enter}
        labelStyle={styles.label_enter}
        contentStyle={{ flexDirection: "row-reverse" }}
      >
        Provisorio - MAIN
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button_enter: {
    width: "60%",
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#1e66fd",
    backgroundColor: "#1e66fd",
    marginTop: 16,
  },
  button_create: {
    width: "60%",
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#1e66fd",
    backgroundColor: "transparent",
    marginTop: 16,
  },
  label_enter: {
    color: "#ffff",
    fontWeight: "bold",
  },
  buttonLabel: {
    color: "#1e66fd",
    fontWeight: "bold",
  },
  titleBlue: {
    color: "#1e66fd",
    fontWeight: "bold",
  },

});
