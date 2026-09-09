# Plano de Implementação - Página de Vendas Lomove

Criação da página de vendas estratégica pós-diagnóstico, modelada em referências visuais e estruturais de alta conversão para o público 45+. A página será dividida em 4 seções principais com gatilhos mentais de prova social, garantia e oferta clara.

## 1. Estrutura da Página de Vendas (SalesPage)

A página será implementada como uma nova rota ou estado final do quiz, contendo:

### Seção 1: Alerta e Conexão (Início)
- **Cabeçalho de Urgência:** Atenção personalizada baseada no nome e diagnóstico.
- **Copy Sistêmica:** Texto explicando que a causa é profunda e precisa de tratamento "de dentro para fora".
- **Audio/WhatsApp Player:** Reutilizar o componente `WhatsAppPlayer` com o recado da Dra. Alana (representando a autoridade).
- **Chamada Visual:** Texto "Escute o áudio e veja o que vai receber".

### Seção 2: Oferta Irresistível
- **Prova Social (Carrossel 1):** Depoimentos reais ou simulados de pessoas que reverteram a dor.
- **Bloco de Preço:** Design de "âncora de preço" (De R$ 57,00 por apenas R$ 29,00).
- **CTA Principal:** Botão grande com micro-copy acima: "Aperte no botão para fazer o pagamento e receber o acesso no seu whatsapp".

### Seção 3: Entrega e Valor (O que você vai receber)
- **Visual do Produto:** Placeholder para o infográfico/mockup do plano Lomove.
- **Benefícios (Bullets):** 4 pontos detalhando o conteúdo do protocolo (exercícios 10 min, suporte, acesso vitalício, etc).
- **CTA Reforço:** Botão "Acessar meu plano personalizado".

### Seção 4: Garantia, FAQ e Fechamento
- **Selo de Garantia:** Estilo "Blindada" (100% de satisfação ou dinheiro de volta em 60 dias).
- **Bloco de Preço Evidente:** Repetição da oferta com foco visual no valor R$ 29,00.
- **Carrossel 2:** Mais depoimentos escritos para quebrar objeções finais.
- **FAQ:** Seção de perguntas frequentes sanando dúvidas técnicas e de acesso.
- **CTA Final:** Última chamada para ação no rodapé.

## Detalhes Técnicos

- **Componente:** `src/components/quiz/screens/SalesPage.tsx`
- **Integração:** Adicionar `sales` como novo `StepKind` em `types.ts` e atualizar `QuizFlow.tsx` para redirecionar o `onAccept` da `DiagnosisScreen` para esta nova etapa.
- **Design:** Manter Poppins Bold para títulos, cores semânticas (Verde para CTAs, Vermelho para alertas), e layout centralizado mobile-first.
- **Imagens:** Utilizar os placeholders/assets já mapeados e preparar espaço para os novos mockups.

## Próximos Passos
1. Criar o componente `SalesPage.tsx` com as 4 seções.
2. Atualizar tipos e fluxo do quiz.
3. Implementar carrosséis e FAQ.
4. Refinar estilo visual baseado nas imagens de referência.
