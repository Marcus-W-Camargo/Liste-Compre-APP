# 🛒 Liste & Compre — APP

> **Planeje. Compre. Acompanhe.**  
> Aplicativo mobile do ecossistema **Liste & Compre**, desenvolvido com React Native, Expo e TypeScript para acompanhar a compra antes, durante e depois do mercado.

[![React Native](https://img.shields.io/badge/React%20Native-0.86-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React](https://img.shields.io/badge/React-19.2-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Database%20%2B%20Storage-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Android](https://img.shields.io/badge/Android-V1-3DDC84?logo=android&logoColor=white)](https://developer.android.com/)
[![CI](https://github.com/Marcus-W-Camargo/Liste-Compre-APP/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Marcus-W-Camargo/Liste-Compre-APP/actions/workflows/ci.yml)

**Versão:** `1.0.0`  
**Plataforma inicial:** Android  
**Status:** V1 consolidada na `main`; distribuição pública ainda não documentada no repositório.

---

## 📸 Interface

O aplicativo foi projetado especificamente para uso mobile, com navegação por toque e gestos, campos numéricos adaptados ao Android e persistência local da compra em andamento.

> **Capturas de tela:** antes da publicação pública, adicionar de 3 a 4 screenshots reais em `docs/screenshots/`, priorizando:
>
> - Início;
> - Listas;
> - Compra em andamento;
> - Histórico.

<!--
Exemplo para ativar futuramente:

<p align="center">
  <img src="docs/screenshots/home.png" width="220" alt="Tela inicial do Liste & Compre APP">
  <img src="docs/screenshots/listas.png" width="220" alt="Tela de listas do Liste & Compre APP">
  <img src="docs/screenshots/compra.png" width="220" alt="Compra em andamento no Liste & Compre APP">
  <img src="docs/screenshots/historico.png" width="220" alt="Histórico de compras do Liste & Compre APP">
</p>
-->

---

## Sobre o projeto

O **Liste & Compre — APP** é a aplicação mobile do ecossistema **Liste & Compre**.

Ele não é um WebView e não é uma simples adaptação responsiva do site. O projeto possui base de código própria em **React Native + Expo**, mantendo integração com a mesma infraestrutura de autenticação e dados utilizada pelo Liste & Compre Web.

A proposta é conectar duas etapas que normalmente ficam separadas:

1. **planejar a compra**, organizando listas, produtos, quantidades e medidas;
2. **executar a compra**, registrando preços, extras, pendências e total em tempo real.

Após a finalização, os dados passam a compor o histórico da conta e podem ser reutilizados em compras futuras.

### Por que um aplicativo separado?

A versão mobile foi criada para oferecer comportamento próprio de aplicativo:

- interação por toque;
- navegação horizontal por gestos;
- teclado numérico contextual;
- câmera e galeria para foto de perfil;
- sessão autenticada em armazenamento seguro;
- estado de compra persistido no dispositivo;
- interface ajustada à área segura da tela;
- navegação otimizada para uso com uma mão sempre que possível.

---

## ✨ Principais funcionalidades

### 📝 Planejamento e listas

- criação de listas;
- edição e renomeação;
- exclusão com confirmação;
- catálogo interno de produtos;
- autocomplete;
- categorias;
- quantidade;
- unidade ou quilograma;
- data prevista para a compra.

O catálogo interno possui mais de **900 produtos** e continua permitindo a inclusão de itens personalizados.

### 🛒 Compra em andamento

Durante uma compra, o usuário pode:

- marcar produtos;
- registrar preço;
- alterar quantidade;
- alternar entre unidade e quilograma;
- acompanhar valor por item;
- acompanhar total parcial;
- visualizar progresso;
- adicionar itens extras;
- remover itens;
- tratar produtos pendentes antes da finalização.

### 💰 Valores e pesos

Os campos monetários seguem o padrão brasileiro e foram adaptados para entrada rápida em teclado numérico.

```text
1      → R$ 0,01
12     → R$ 0,12
123    → R$ 1,23
1234   → R$ 12,34
```

Valor máximo suportado por item:

```text
R$ 9.999,99
```

Itens em quilogramas aceitam valores decimais, por exemplo:

```text
0,250 Kg
0,500 Kg
1,250 Kg
```

### ➕ Itens extras

Produtos adicionados durante a compra sem terem sido planejados previamente são registrados como **extras** e permanecem identificados no histórico.

### 🧾 Histórico

Compras concluídas podem preservar:

- nome da lista;
- data;
- produtos;
- quantidade;
- medida;
- preço;
- valor total;
- itens extras.

Uma compra anterior também pode ser reutilizada como base para uma nova lista, sem reaproveitar preços históricos como preços atuais.

### 👤 Conta e perfil

A área de conta oferece:

- nome;
- e-mail;
- foto de perfil;
- Central de Ajuda;
- Política de Privacidade;
- informações do criador;
- encerramento de sessão;
- exclusão permanente da conta.

A foto de perfil pode ser selecionada da galeria ou capturada pela câmera e é armazenada no **Supabase Storage**.

### 🔐 Autenticação

Fluxos suportados:

- cadastro;
- login;
- verificação de cadastro;
- recuperação de acesso;
- verificação de recuperação;
- redefinição de senha;
- logout;
- exclusão permanente da conta com verificação por código.

---

## 🧭 Navegação

As quatro áreas principais são:

```text
Início → Listas → Comprar → Histórico
```

Além da navegação direta, as telas principais utilizam um pager horizontal para permitir navegação por swipe com comportamento visual contínuo durante o gesto.

---

## 🧠 Decisões de arquitetura

### Aplicativo independente da versão web

Web e mobile compartilham backend e dados da conta, mas possuem:

- interfaces independentes;
- bases de código independentes;
- fluxos de navegação próprios;
- persistência local apropriada para cada plataforma.

### Compra em andamento permanece no dispositivo

A compra ainda não finalizada não é tratada como dado remoto comum.

Ela é persistida localmente e separada por usuário no dispositivo. Isso permite sair da tela de compra, navegar pelo app e retornar ao ponto em que a sessão estava.

> O aplicativo **não é uma solução offline-first completa**. A sessão de compra é local, mas autenticação e sincronização dos dados da conta continuam dependendo dos serviços remotos.

### Sincronização com revisão otimista

Os dados sincronizados utilizam as RPCs existentes:

```text
lc_load_data
lc_save_data
```

O estado remoto utiliza uma revisão numérica. Ao salvar, o aplicativo envia a revisão esperada e trata conflitos quando há alterações mais recentes em outro dispositivo.

Esse modelo evita sobrescrever silenciosamente dados remotos mais novos.

### Separação entre dados remotos e transitórios

**Sincronizados com a conta:**

- listas;
- rascunhos;
- compras concluídas;
- histórico;
- informações de perfil aplicáveis.

**Mantido localmente:**

- sessão da compra em andamento.

---

## 🔒 Segurança e privacidade

A arquitetura foi construída com redução de exposição e separação de responsabilidades.

Entre as práticas presentes no projeto:

- uso apenas de credenciais públicas apropriadas no cliente;
- ausência de chave `service_role` no aplicativo;
- Supabase Auth;
- sessão autenticada em `expo-secure-store`;
- Storage associado ao usuário autenticado;
- validação de contratos de segurança;
- confirmação adicional para operações destrutivas;
- código de verificação para exclusão permanente de conta;
- CI com permissões mínimas;
- instalação determinística de dependências.

### Sessão segura

A sessão do Supabase utiliza:

```text
expo-secure-store
```

O armazenamento foi adaptado para dividir valores maiores em blocos, respeitando limites por entrada do armazenamento seguro do sistema operacional.

### Cadeia de fornecimento

O projeto mantém `package-lock.json` versionado e o CI instala dependências com:

```bash
npm ci
```

O workflow do GitHub Actions utiliza permissão mínima:

```yaml
permissions:
  contents: read
```

O checkout também é executado com:

```yaml
persist-credentials: false
```

---

## 🧪 Qualidade e integração contínua

A branch `main` é validada pelo workflow **Mobile CI**.

O pipeline verifica:

1. instalação determinística de dependências;
2. compatibilidade das dependências com o Expo;
3. sincronização do catálogo oficial;
4. TypeScript;
5. lint;
6. testes unitários;
7. testes de contrato de segurança;
8. Expo Doctor;
9. exportação do bundle JavaScript para Android;
10. auditoria de dependências.

Validações locais disponíveis:

```bash
npm run typecheck
npm run lint
npm test
npm run doctor
npm run export:android
```

Validação agregada:

```bash
npm run check
```

---

## 🏗️ Stack

| Camada | Tecnologia | Responsabilidade |
| --- | --- | --- |
| Aplicativo | React Native 0.86 | Interface mobile |
| Framework | Expo SDK 57 | Toolchain e APIs nativas |
| UI | React 19.2 | Componentes |
| Linguagem | TypeScript 6 | Tipagem estática |
| Rotas | Expo Router | Navegação e rotas |
| Pager | React Native Pager View | Navegação horizontal |
| Tabs | React Navigation Material Top Tabs | Integração de navegação por abas |
| Autenticação | Supabase Auth | Usuários e sessões |
| Banco | PostgreSQL / Supabase | Dados sincronizados |
| Storage | Supabase Storage | Fotos de perfil |
| Sessão segura | Expo Secure Store | Persistência da autenticação |
| Estado local | AsyncStorage | Compra em andamento e estado local apropriado |
| Conectividade | NetInfo | Estado de rede |
| Mídia | Expo Image Picker | Câmera e galeria |
| Processamento | Expo Image Manipulator | Tratamento de imagens |
| Tipografia | Poppins / Expo Google Fonts | Identidade visual |
| Testes | Vitest | Testes automatizados |
| Lint | Oxlint | Análise estática |
| CI | GitHub Actions | Validação automática |

---

## 📁 Estrutura do projeto

```text
.
├── app/
│   ├── (tabs)/            # Início, Listas, Comprar e Histórico
│   ├── compra/            # Fluxo da compra em andamento
│   ├── conta.tsx          # Conta e perfil
│   ├── ajuda.tsx          # FAQ e feedback
│   ├── privacidade.tsx    # Política de Privacidade
│   └── ...                # Autenticação e demais rotas
│
├── src/
│   ├── assets/            # Recursos visuais
│   ├── components/        # Componentes reutilizáveis
│   ├── config/            # Configuração de ambiente
│   ├── data/              # Catálogo interno
│   ├── domain/            # Regras e validações de domínio
│   ├── lib/               # Integrações e serviços
│   ├── providers/         # Providers globais
│   ├── state/             # Estado sincronizado
│   └── storage/           # Persistência local
│
├── scripts/               # Automação do catálogo
├── tests/                 # Testes unitários e de segurança
├── docs/                  # Documentação complementar
├── .github/workflows/     # CI
├── app.json               # Configuração Expo
├── eas.json               # Perfis de build
├── package.json
└── package-lock.json
```

---

## ⚙️ Configuração local

### Requisitos

- Node.js `>= 22.13.0`;
- npm;
- Android Studio;
- Android SDK;
- JDK compatível com o ambiente Android;
- dispositivo Android ou emulador;
- projeto Supabase configurado.

### Clonar

```bash
git clone https://github.com/Marcus-W-Camargo/Liste-Compre-APP.git
cd Liste-Compre-APP
```

### Instalar dependências

```bash
npm ci
```

### Variáveis de ambiente

Copie `.env.example` para `.env` e configure:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_WEB_API_URL=
```

> Nunca utilize no cliente `service_role` ou qualquer chave administrativa do Supabase.

---

## ▶️ Desenvolvimento

```bash
npm run start
npm run android
npm run ios
```

A plataforma inicial do projeto é **Android**. A existência de configuração e suporte de desenvolvimento para iOS não representa, por si só, uma release pública para essa plataforma.

---

## 📦 Produção Android

Identidade atual do aplicativo:

```text
Version: 1.0.0
Package: com.marcuscamargo.listecompre
```

O `eas.json` mantém perfis distintos:

- **development** — development client para uso interno;
- **preview** — distribuição interna em formato APK;
- **production** — build Android em formato **AAB (Android App Bundle)**.

Essa separação evita tratar um APK de preview como artefato oficial de produção.

### Assinatura

Builds oficiais de Android devem utilizar uma chave privada de release.

Essa chave:

- não deve ser publicada;
- não deve ser incluída no repositório;
- precisa ser preservada para futuras atualizações do aplicativo.

### Distribuição pública

O repositório ainda não documenta uma URL pública definitiva de distribuição da V1.0.0.

Quando a distribuição oficial estiver estabelecida, esta seção deve incluir somente informações verificáveis, como:

- canal oficial de download;
- formato disponibilizado;
- versão;
- checksum do artefato, quando aplicável;
- data da release.

---

## 🌐 Relação com o Liste & Compre Web

**Aplicação web:**  
https://listeecompre.vercel.app/

**Repositório web:**  
https://github.com/Marcus-W-Camargo/liste-e-compre

Web e mobile compartilham autenticação e infraestrutura de dados, mas permanecem projetos independentes, desenvolvidos para experiências diferentes.

---

## 📌 Estado da V1

A versão `1.0.0` reúne, no código atual:

- autenticação;
- cadastro;
- recuperação de conta;
- criação e gerenciamento de listas;
- catálogo de produtos;
- autocomplete;
- compra em andamento;
- preços;
- unidades e quilogramas;
- itens extras;
- histórico;
- reutilização de compras anteriores;
- perfil;
- foto de usuário;
- exclusão de conta;
- FAQ;
- feedback;
- Política de Privacidade;
- navegação por tabs;
- navegação por swipe;
- sessão segura;
- sincronização Supabase;
- persistência local da compra;
- testes;
- contratos de segurança;
- CI;
- configuração de build Android.

---

## 🗺️ Próximos passos de documentação

Antes da divulgação pública do repositório como peça principal de portfólio:

- [ ] adicionar screenshots reais do aplicativo;
- [ ] documentar o canal oficial de distribuição Android;
- [ ] adicionar checksum somente após congelar o artefato oficial;
- [ ] registrar release pública quando aplicável;
- [ ] criar uma versão em inglês separada (`README.en.md`) se houver necessidade de apresentação internacional.

---

## 👨‍💻 Autor

Desenvolvido por **Marcus Camargo**.

**GitHub:**  
https://github.com/Marcus-W-Camargo

**Portfólio:**  
https://marcuscamargo-portfolio.mcpt.workers.dev/

---

## Liste & Compre

**Planeje. Compre. Acompanhe.**

Uma experiência construída para continuar útil antes, durante e depois de cada compra.
