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

**Versão pública:** `1.0`  
**Plataforma inicial:** Android  
**Status:** release pública disponível via Cloudflare R2; desenvolvimento consolidado na `main`.

**Download oficial do APK:**  
https://pub-2b70722df74e452daa43c450bd639a7b.r2.dev/android/v1.0/liste-e-compre-v1.0.apk

---

## 📸 Interface

O aplicativo foi projetado especificamente para uso mobile, com navegação por toque e gestos, campos numéricos adaptados ao Android e persistência local da compra em andamento.

> **Capturas de tela:** adicionar de 3 a 4 screenshots reais em `docs/screenshots/`, priorizando:
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

Após a finalização, os dados passam a compor o histórico da conta e podem ser reutilizados em compras futuras. A lista utilizada deixa de aparecer entre as listas disponíveis para compra após a conclusão, evitando duplicidade entre fluxo ativo e histórico.

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

Ao concluir a compra, a lista utilizada é removida das listas disponíveis e a compra passa a existir no histórico. Enquanto a compra não é concluída, a sessão permanece identificada como **Em andamento**.

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
- **Apoie-me**;
- Política de Privacidade;
- informações do criador;
- encerramento de sessão;
- exclusão permanente da conta.

A foto de perfil pode ser selecionada da galeria ou capturada pela câmera e é armazenada no **Supabase Storage**.

### 🧡 Apoie-me

O aplicativo permanece gratuito e sem propagandas. A área **Apoie-me** permite contribuições voluntárias via PIX para apoiar a manutenção do Liste & Compre e o desenvolvimento de projetos atuais e futuros.

A tela oferece:

- PIX por e-mail: `listeecompre@gmail.com`;
- QR Code PIX sem valor fixo;
- botão para copiar o código PIX;
- link para outros projetos no portfólio;
- consentimento opcional para agradecimento público no Instagram;
- orientação para que apoiadores que desejem agradecimento público incluam o nome na observação do PIX.

A contribuição é totalmente opcional e não desbloqueia recursos, funcionalidades ou vantagens no aplicativo.

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
| Clipboard | Expo Clipboard | Cópia do código PIX |
| Tipografia | Poppins / Expo Google Fonts | Identidade visual |
| Testes | Vitest | Testes automatizados |
| Lint | Oxlint | Análise estática |
| CI | GitHub Actions | Validação automática |
| Distribuição | Cloudflare R2 | Hospedagem pública do APK |

---

## 📁 Estrutura do projeto

```text
.
├── app/
│   ├── (tabs)/            # Início, Listas, Comprar e Histórico
│   ├── compra/            # Fluxo da compra em andamento
│   ├── conta.tsx          # Conta e perfil
│   ├── apoie.tsx          # Apoio voluntário via PIX
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
├── eas.json               # Perfis auxiliares de build
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
- JDK 17;
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

Identidade de distribuição atual:

```text
Release pública: 1.0
Package: com.marcuscamargo.listecompre
Formato público: APK
Canal: Cloudflare R2
```

A release pública atual é gerada **localmente**, sem depender de conta Expo/EAS para assinatura ou distribuição.

Fluxo usado no ambiente Android:

```bash
npx expo prebuild --platform android
cd android
./gradlew generateCodegenArtifactsFromSchema
./gradlew assembleRelease
```

Artefato gerado:

```text
android/app/build/outputs/apk/release/app-release.apk
```

O arquivo distribuído publicamente é renomeado para:

```text
liste-e-compre-v1.0.apk
```

> O arquivo `eas.json` permanece no projeto como configuração auxiliar, mas não é o mecanismo utilizado para a release pública atual.

### Assinatura

Builds oficiais Android utilizam uma chave privada de release mantida fora do repositório.

Essa chave:

- não deve ser publicada;
- não deve ser incluída no repositório;
- precisa ser preservada e mantida em backups redundantes para futuras atualizações;
- define a linha de atualização compatível dos APKs assinados com ela.

A distribuição `1.0` publicada em setembro de 2026 inicia uma **nova linha de assinatura**. Builds antigas assinadas com outra chave não podem ser atualizadas diretamente por cima desta versão; nesses casos, é necessário desinstalar a instalação antiga antes de instalar a nova.

### Distribuição pública

**Versão:** `1.0`  
**Formato:** APK  
**Arquivo:** `liste-e-compre-v1.0.apk`  
**Storage:** Cloudflare R2  
**Objeto:** `android/v1.0/liste-e-compre-v1.0.apk`

**Download oficial:**  
https://pub-2b70722df74e452daa43c450bd639a7b.r2.dev/android/v1.0/liste-e-compre-v1.0.apk

As versões antigas armazenadas no bucket foram removidas antes da publicação desta nova linha de distribuição.

---

## 🌐 Relação com o Liste & Compre Web

**Aplicação web:**  
https://listeecompre.vercel.app/

**Repositório web:**  
https://github.com/Marcus-W-Camargo/liste-e-compre

Web e mobile compartilham autenticação e infraestrutura de dados, mas permanecem projetos independentes, desenvolvidos para experiências diferentes.

---

## 📌 Estado da V1

A release pública `1.0` reúne, no código atual:

- autenticação;
- cadastro;
- recuperação de conta;
- criação e gerenciamento de listas;
- catálogo de produtos;
- autocomplete;
- compra em andamento;
- remoção da lista disponível após conclusão da compra;
- preços;
- unidades e quilogramas;
- itens extras;
- histórico;
- reutilização de compras anteriores;
- perfil;
- foto de usuário;
- área **Apoie-me** com PIX e QR Code;
- consentimento opcional para agradecimento público;
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
- build Android local assinado;
- distribuição pública via Cloudflare R2.

---

## 🗺️ Próximos passos de documentação

- [ ] adicionar screenshots reais do aplicativo;
- [ ] adicionar checksum do APK oficial, caso passe a ser publicado como parte do processo de release;
- [ ] registrar releases futuras com changelog;
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