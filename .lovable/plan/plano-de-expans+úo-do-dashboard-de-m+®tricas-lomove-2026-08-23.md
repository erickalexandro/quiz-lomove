# Plano de Expansão do Dashboard de Métricas - Lomove

Este plano visa transformar o dashboard administrativo atual em uma ferramenta robusta de análise de funil, permitindo identificar gargalos e otimizar a conversão com base em dados reais de abandono, tempo por etapa e distribuição de respostas.

## Alterações de Interface (UI)

- **Novo Componente de Abandono por Etapa**: Substituição do gráfico de barras simples por um gráfico de funil detalhado (etapas 1-22).
  - Incluir números absolutos e percentual de abandono relativo.
  - Implementar destaque visual (Cores de Alerta) para etapas com abandono fora da média.
- **Gráfico de Tempo Médio por Etapa**: Adição de uma visualização específica para identificar perguntas confusas ou irrelevantes.
- **Funil de Conversão Pós-Quiz**: Novo card mostrando o fluxo: Início -> Conclusão -> Diagnóstico -> Checkout -> Compra.
- **Detalhamento de Respostas**: Expansão da seção de métricas para incluir a distribuição de respostas de todas as perguntas (idade, intensidade, etc.).
- **Filtros e Segmentação**: 
  - Adição de seletor de dispositivo (Mobile vs Desktop).
  - Adição de seletor de período (Evolução Temporal).

## Detalhes Técnicos

- **Mock Data Estruturado**: Criação de um gerador de dados mock realistas que simulem o funil completo e o comportamento das 22 etapas.
- **Componentes Shadcn/Recharts**: Utilização de componentes de gráfico para facilitar a leitura rápida dos dados.
- **Lógica de Alerta**: Implementação de cálculo de desvio padrão simples para destacar etapas com abandono crítico.
- **Refatoração de `src/routes/admin.tsx`**: Divisão da aba "metrics" em sub-seções ou componentes menores para manter a manutenibilidade.

## Segurança e Performance

- Manter o acesso restrito via rota `/admin`.
- Otimizar o carregamento dos gráficos para garantir fluidez mesmo com grande volume de dados simulados.
