# V1.1.0 — áreas seguras

Branch: `fix/v1.1.0-safe-area`. Não fazer merge antes da validação em aparelho.

## Arquitetura e revisão

Este repositório é um app Expo/React Native nativo, sem WebView, HTML, CSS ou dependência react-native-web. Portanto, `viewport-fit=cover` e `env(safe-area-inset-top/right/bottom/left)` não se aplicam a esta distribuição. O equivalente nativo é `react-native-safe-area-context`, que mede os recortes e as barras do sistema. Não foram alterados outros repositórios.

- O layout raiz protege topo e laterais antes dos avisos de conexão e da navegação.
- Screen protege a borda inferior das rotas fora das abas.
- Nas quatro abas, Screen desativa essa borda: o contêiner do navigator a protege uma única vez, preservando a barra de 70 pontos e sua cor branca.
- PageHeader e TabTopBar ficam dentro dessa região protegida, sem compensações adicionais.
- BottomSheet usa provider próprio para a janela Modal, protege as quatro bordas e permite rolar conteúdo com teclado ou pouco espaço. O fundo cobre também as barras do sistema.
- A tela inicial passa a permitir rolagem em alturas pequenas, mantendo o resumo ao final do espaço disponível.
- Campos de preço/quantidade/medida podem quebrar linha em telas estreitas.
- Não há FAB ou controles fixed/sticky nesta base. Os elementos absolutos encontrados são decoração de Screen e fundo de Modal, que podem ocupar as bordas.
- A orientação nativa continua retrato, conforme app.json.

Referências: [Expo safe areas](https://docs.expo.dev/develop/user-interface/safe-areas/), [Safe area context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/), [Modal](https://reactnative.dev/docs/modal).

## Validação automatizada

O Mobile CI roda nesta branch: alinhamento Expo, catálogo, TypeScript, lint, testes, Expo Doctor, bundle Android e auditoria. Consulte o resultado do commit atual no GitHub Actions. Exportar JavaScript não gera APK nem comprova a geometria no aparelho.

## Instalar para teste no Android

1. Obter a branch:
   ```sh
   git clone --branch fix/v1.1.0-safe-area https://github.com/Marcus-W-Camargo/Liste-Compre-APP.git
   cd Liste-Compre-APP
   npm ci
   ```
2. Copiar `.env.example` para `.env` e preencher as três variáveis públicas do ambiente usado pela V1. Nunca colocar chave administrativa.
3. Executar `npm run check`.
4. Para APK interno, usar o perfil existente:
   ```sh
   npx eas-cli login
   npx eas-cli build --platform android --profile preview
   ```
   A conta Expo precisa ter acesso ao projeto. Se for solicitado vínculo a um projeto, confirmar a identidade do projeto existente antes de criar outro. As mesmas variáveis públicas devem estar disponíveis no ambiente do build.
5. Ao concluir, abrir o link/QR fornecido pelo EAS no celular e instalar o APK. Um APK de assinatura diferente não atualiza a instalação atual. Não desinstalar a V1 com compra local pendente; preservar a assinatura existente ou preparar uma instalação de teste separada.
6. Expo Go só é opção se a versão instalada suportar o SDK 57 e os módulos deste app. O APK preview é o caminho documentado para validar a distribuição nativa.

## Matriz de teste físico (a preencher)

Registrar modelo, Android, modo de navegação, versão instalada, SHA testado e screenshots. Ainda é necessária execução em aparelho; este roteiro não representa testes aprovados.

| Cenário | Verificação |
| --- | --- |
| Notch/câmera/status bar | Logo, voltar, títulos e avisos offline inteiramente abaixo do recorte |
| Android com 3 botões | As quatro abas e ações finais acima dos botões |
| Android com gestos | Abas acima do indicador; swipes horizontais continuam funcionando |
| 320/360/412 pontos de largura | Campos não escapam pela lateral; preço, quantidade e medida acessíveis |
| Tela baixa / fonte ampliada | Início rola até o resumo; último item e ação final acessíveis |
| Teclado | Login, cadastro, salvar/renomear lista e item extra: foco e confirmar alcançáveis por rolagem |
| Modais longos | Itens do histórico e destinos de pendências rolam até a última ação |
| Sem recorte | Espaçamento e altura de 70 pontos da barra preservados |
| Rotação do aparelho | App mantém retrato; sem cortes ao voltar do teclado/câmera |
| Retomar app | Reabrir e retornar de câmera/galeria sem sobreposição |

Usar uma lista de teste. Não finalizar compras reais ou executar exclusão de conta para validar layout.

## Aparelho do usuário: Samsung Galaxy S21 FE, Expo Go via USB

A versão Android ainda deve ser consultada em Configurações → Sobre o telefone → Informações do software.

Com a branch e o .env preparados no computador que já executava a V1:
```sh
adb devices
adb reverse tcp:8081 tcp:8081
npx expo start --localhost --clear
```
Autorizar a depuração USB no celular. O dispositivo deve aparecer como `device`, não `unauthorized`. Com o servidor ativo, pressionar `a` para abrir no Android conectado. Se necessário, abrir no Expo Go a URL local mostrada pelo Expo. Manter o servidor rodando.

No S21 FE, alternar Configurações → Visor → Barra de navegação entre Botões e Gestos de deslizar e repetir a matriz. Não é necessário gerar APK para esta primeira verificação. A validação em Expo Go não substitui uma futura validação do APK preview.
