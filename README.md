# 💰 ContaComigo

Aplicativo mobile desenvolvido com React Native, voltado para o controle de contas pessoais. A proposta é oferecer uma experiência simples e intuitiva para organizar despesas, receitas e visualizar o saldo total de forma eficiente.

## 📱 Funcionalidades principais

* **Resumo geral**: visualização de quantidade de contas por status (pagar, atrasadas, pagas).
* **Gráfico interativo**: pizza colorida com distribuição das contas.

 ![image](https://github.com/user-attachments/assets/9851f98f-9b8d-4be4-a9c3-472f6af02ea8)

* **Cartões informativos**: números destacados para cada categoria, com cores representativas.
* **Indicador de carregamento**: enquanto busca dados da API, exibe spinner com mensagem.
* **Layout responsivo**: centralizado e fluido em diferentes tamanhos de tela.
* Armazenamento local utilizando AsyncStorage
* Filtragem de contas por email do usuário
* Registro da data da movimentação
* Cadastro de contas com valor e descrição

## 🛠️ Tecnologias utilizadas

- **React Native** (Expo)
- **React Navigation**
- **React Native Chart Kit** (gráficos)
- **React Native Paper** (componentes visuais)
- **Axios** (requisições HTTP)
- **AsyncStorage** (armazenamento local)
- **Context API** (gerenciamento de estado global)
- MockApi (simulação de backend para testes locais)

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

