# 🛒 Liste & Compre — APP

Aplicativo mobile oficial do **Liste & Compre**, construído com React Native, Expo SDK 57 e TypeScript.

## Arquitetura

- React Native + Expo Router
- Supabase Auth + PostgreSQL + Storage, compartilhados com a aplicação web
- Sessão do Supabase persistida em `expo-secure-store`, dividida em blocos para evitar o limite de tamanho por entrada
- Compra em andamento preservada localmente no dispositivo
- Sincronização de listas/histórico usando as RPCs `lc_load_data` e `lc_save_data`, com revisão otimista
- Cadastro, recuperação e exclusão reutilizam as APIs protegidas existentes do Liste & Compre Web

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run typecheck
npm test
npm run start
```

Preencha `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com a chave publicável do projeto Supabase **Liste e Compre**. Nunca use `service_role` ou secret key no app.

## Branch de desenvolvimento

A V1 está sendo construída em `feat/mobile-app-v1`. A `main` não recebe a aplicação até a validação final.
