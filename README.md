# 🧾 ContaComigo

Aplicativo mobile desenvolvido com **React Native** para auxiliar no controle financeiro pessoal. Exibe um dashboard com resumo de contas a pagar, atrasadas e já pagas, com um gráfico em pizza e cartões indicativos.

## 📱 Funcionalidades principais

* **Resumo geral**: visualização de quantidade de contas por status (pagar, atrasadas, pagas).
* **Gráfico interativo**: pizza colorida com distribuição das contas.

  ![image](https://github.com/user-attachments/assets/aba018ce-1e93-40f0-906a-543e9a708ab8)

* **Cartões informativos**: números destacados para cada categoria, com cores representativas.
* **Indicador de carregamento**: enquanto busca dados da API, exibe spinner com mensagem.
* **Layout responsivo**: centralizado e fluido em diferentes tamanhos de tela.

## 🛠️ Tecnologias utilizadas

* **React Native** – UI cross‑platform mobile.
* **react-native-chart-kit** – gráficos (PieChart).
* **React Native Paper** – componentes como `ActivityIndicator`.
* **Context API** – gerenciamento global de contas.
* **axios** (na service `api`) – chamadas HTTP à API REST.
* **styled-components** ou diretamente `StyleSheet` – estilos responsivos.

## 🔧 Instalação e configuração

1. Clone o repositório:

   ```bash
   git clone https://github.com/weslainesantana/ContaComigo.git
   cd ContaComigo/app
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o app:

   ```bash
   npx expo start
   ```

