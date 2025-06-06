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
        Bem-vindo ao ContaComigo
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Seu app de suporte e acompanhamento personalizado.
      </Text>

      <Button
        mode="contained"
        onPress={() => navigation.replace("Main")}
        style={styles.button}
        icon="login"
        contentStyle={{ flexDirection: "row-reverse" }}
      >
        Entrar
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
  button: {
    backgroundColor: "#1e66fd",
    width: "60%",
    borderRadius: 25,
  },
});
