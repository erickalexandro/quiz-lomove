# Quiz de Diagnóstico Lomove — 22 etapas

Funil de resposta direta em português, mobile-first, para mulheres 45-58 anos com dor crônica nas costas. Uma pergunta por tela, botões grandes, barra de progresso sempre visível, badges de feedback e diagnóstico personalizado no final.

## Decisões confirmadas

- Etapas 11 (quanto já investiu) e 18 (melhor horário) mantidas — total de 22 etapas.
- Etapa 3 com mapa corporal clicável (silhueta SVG).
- Cervical, Quadril/glúteos e Outras usam um diagnóstico fallback genérico de desequilíbrio muscular.
- Áudio do Dr. Elias e imagem do mecanismo entram como placeholders substituíveis.

## Experiência

**Abertura (1)** — Headline do "músculo invisível", 3 selos de confiança, CTA grande e badges (grátis · sem cartão · 2 min).

**Bloco 1 — Situação (2-5)** — Idade, mapa corporal da dor, intensidade (3 faixas com emoji + badge), tela de autoridade do Dr. Elias com player de áudio.

**Bloco 2 — Problema e implicação (6-13)** — Quando a dor piora, impacto no dia a dia (múltipla escolha + badge), badge de validação + tempo de dor, soluções fracassadas, resultado, investimento financeiro, atividade física, horas sentado (badge com dado da Cornell).

**Bloco 3 — Necessidade e primeiro SIM (14-18)** — Sono, implicação do sono, vida sem dor, tela de compromisso dos 15 min/dia, horário de implementação.

**Bloco 4 — Fechamento (19-22)** — Nome, tela do mecanismo com ilustração e 2º SIM, loading animado (~15s) com depoimentos rotativos, e diagnóstico final.

**Tela de diagnóstico (22)** — medidor de comprometimento muscular (verde/amarelo/vermelho) calculado a partir de intensidade, tempo de dor, sono e horas sentado; texto de diagnóstico por região (Lombar / Ciática / Hérnia / fallback); gráfico de previsão de queda da dor em 28 dias; CTA "SIM, QUERO VER MEU PLANO" + link "Ainda tenho dúvidas".

Copy e alternativas seguem literalmente o arquivo `lomove-quiz-completo.md`, sem cortes nem resumos.

## Direção visual

Acolhimento com confiança clínica: base clara e quente, verde-azulado calmo como cor primária, âmbar suave nos badges, tipografia grande e legível (mínimo 18px no corpo, botões com ~60px de altura), muito espaço em branco, uma decisão por tela. Transição suave de slide entre etapas e leve escurecimento/seriedade no bloco de implicação, voltando a tons esperançosos no fechamento. Todas as cores como tokens semânticos no design system.

## Detalhes técnicos

- Rota única `/` (TanStack Start) renderizando um controlador de etapas em memória — sem backend nesta fase; respostas ficam no estado do React (`useReducer`) e persistem em `sessionStorage` para não perder progresso ao recarregar.
- Estrutura: `src/quiz/steps.ts` (definição de dados das 22 etapas), `src/quiz/state.ts` (reducer + tipos), `src/quiz/diagnosis.ts` (cálculo de nível de comprometimento e seleção do texto de diagnóstico), e componentes por tipo de tela em `src/components/quiz/` (`SingleChoice`, `MultiChoice`, `BodyMap`, `NameInput`, `AudioStep`, `MechanismStep`, `LoadingStep`, `DiagnosisStep`, `ProgressBar`, `Badge`).
- Avanço automático em perguntas de escolha única; botão "Continuar" nas de múltipla escolha e telas de conteúdo. Botão de voltar discreto no topo.
- Ilustrações (avatar do Dr. Elias, mecanismo do músculo, silhueta corporal) geradas como assets; player de áudio funcional com arquivo placeholder.
- Meta tags de SEO próprias da rota (título, descrição, og/twitter) em português.
- Sem persistência de leads nesta fase — quando quiser salvar respostas/nome, adiciono Lovable Cloud numa etapa seguinte.
