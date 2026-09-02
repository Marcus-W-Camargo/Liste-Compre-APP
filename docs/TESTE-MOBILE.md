# Roteiro de validação mobile — Liste & Compre

## Gate automatizado

Antes de qualquer teste manual, o CI deve aprovar: TypeScript estrito, Oxlint, testes Vitest, Expo Doctor e export do bundle Android.

## Matriz manual mínima

Testar em Android físico, modo retrato, com teclado aberto/fechado e alternando Wi-Fi/dados móveis.

1. Cadastro: nome inválido, e-mail inválido, senha fraca, código incorreto e cadastro válido.
2. Login: senha inválida, login válido, fechar e reabrir app mantendo sessão.
3. Lista: criar, autocomplete, categorias, un/Kg, excluir item, salvar, editar e excluir lista.
4. Compra: iniciar, fechar/reabrir app, informar preço/quantidade, marcar item, adicionar extra, remover item.
5. Pendências: tentar finalizar com pendentes, apagar e transferir para outra lista.
6. Conectividade: desligar internet durante compra; a sessão local deve permanecer. Religar e validar sincronização.
7. Histórico: total, itens, extras e “Refazer a mesma compra”.
8. Perfil: carregar foto, trocar, excluir e validar acesso privado.
9. Segurança: logout com sincronização pendente; exclusão de conta por código; confirmar que dados não aparecem após sair.
10. UX: nenhuma ação principal deve exigir toque preciso; conferir scroll com teclado, safe area, textos longos e nomes de lista grandes.

## Critério de bloqueio

Qualquer crash, perda de compra local, sobrescrita silenciosa de conflito, exposição de segredo, falha de RLS ou exclusão sem confirmação bloqueia o release.
