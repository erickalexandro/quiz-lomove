import type { Step } from "./types";
import pescocoAsset from "@/assets/quiz/regiao/pescoco.webp";
import ombrosAsset from "@/assets/quiz/regiao/ombros.webp";
import lombarAsset from "@/assets/quiz/regiao/lombar.webp";
import ciaticaAsset from "@/assets/quiz/regiao/ciatica.webp";
import quadrilAsset from "@/assets/quiz/regiao/quadril.webp";
import herniaAsset from "@/assets/quiz/regiao/hernia.webp";
import outrasAsset from "@/assets/quiz/regiao/outras.webp";
import mecanismo2Asset from "@/assets/mecanismo-2.webp";

/**
 * As 22 etapas do quiz Lomove, na ordem exata do documento de especificação.
 * A copy aqui é a fonte da verdade — não resumir nem reordenar.
 */
export const STEPS: readonly Step[] = [
  // ── BLOCO 1 — ABERTURA E SITUAÇÃO ──────────────────────────────────────
  {
    id: "intro",
    block: 1,
    kind: "intro",
  },

  {
    id: "idade",
    block: 1,
    kind: "single",
    question: "Qual é a sua idade?",
    options: [
      { value: "20-30", label: "20 a 30 anos" },
      { value: "31-40", label: "31 a 40 anos" },
      { value: "41-50", label: "41 a 50 anos" },
      { value: "50+", label: "50 anos ou mais" },
    ],
  },
  {
    id: "altura",
    block: 1,
    kind: "numeric",
    question: "Qual é a sua altura?",
    subtitle: "Pode colocar um valor próximo se não souber exatamente.",
    placeholder: "Ex: 165",
    unit: "cm",
    min: 100,
    max: 250,
  },
  {
    id: "peso",
    block: 1,
    kind: "numeric",
    question: "Quanto você pesa hoje?",
    subtitle: "Pode colocar um valor próximo se não souber exatamente.",
    placeholder: "Ex: 75",
    unit: "kg",
    min: 30,
    max: 300,
  },
  {
    id: "regiao",
    block: 1,
    kind: "multi",
    question: "Que parte do corpo você sente mais dor ou desconforto?",
    subtitle: "Selecione as opções que se aplicam a você",
    options: [
      { value: "pescoco", label: "Pescoço e Cervical", image: pescocoAsset.url },
      { value: "ombros", label: "Ombros", image: ombrosAsset.url },
      { value: "lombar", label: "Parte inferior das costas", image: lombarAsset.url },
      { value: "ciatica", label: "Ciática (dor que desce para a perna)", image: ciaticaAsset.url },
      { value: "quadril", label: "Quadris", image: quadrilAsset.url },
      { value: "hernia", label: "Tenho hérnia de disco diagnosticada", image: herniaAsset.url },
      { value: "outras", label: "Outras partes do corpo", image: outrasAsset.url },
    ],
  },

  {
    id: "intensidade",
    block: 1,
    kind: "single",
    question:
      "Em uma escala de 0 a 10, qual a intensidade da sua dor na maioria dos dias?",
    options: [
      {
        value: "leve",
        emoji: "😌",
        label: "Leve (0-3)",
        hint: "incomoda, mas tenho medo de piorar",
      },
      {
        value: "moderada",
        emoji: "😣",
        label: "Moderada (4-6)",
        hint: "atrapalha várias coisas no dia",
        followUpBadge:
          "Dores nesse nível não é normal. Vamos entender melhor o que está acontecendo.",
      },
      {
        value: "intensa",
        emoji: "😖",
        label: "Intensa (7-10)",
        hint: "impossível de ignorar, afeta tudo",
        followUpBadge:
          "Dores nesse nível não é normal. Vamos entender melhor o que está acontecendo.",
      },
    ],
  },

  { 
    id: "audio", 
    block: 1, 
    kind: "audio",
    // badge removido aqui e movido para a etapa correta (tempo) conforme solicitado
    // script removido para esconder a opção "Prefere ler o recado?"
    // script: [ ... ]
  },

  // ── BLOCO 2 — PROBLEMA E IMPLICAÇÃO ────────────────────────────────────
  {
    id: "piora",
    block: 2,
    kind: "single",
    question: "Em que momento do dia a dor piora mais?",
    options: [
      { value: "acordar", emoji: "🌅", label: "Ao acordar" },
      {
        value: "sentado",
        emoji: "💺",
        label: "Depois de ficar muito tempo sentado(a)",
      },
      { value: "noite", emoji: "🌙", label: "À noite, na hora de dormir" },
      { value: "esforco", emoji: "🏋️", label: "Depois de esforço físico" },
      { value: "sempre", label: "Não tem um padrão — dói o dia todo" },
    ],
  },

  {
    id: "impacto",
    block: 2,
    kind: "multi",
    question: "Como essa dor tem afetado o seu dia a dia?",
    subtitle: "Pode marcar mais de uma opção.",
    options: [
      {
        value: "atividades",
        emoji: "😔",
        label: "Não consigo mais fazer atividades que amo (exercício, esporte, lazer)",
      },
      {
        value: "filhos",
        emoji: "👶",
        label: "Tenho dificuldade para brincar ou cuidar dos filhos/netos",
      },
      { value: "trabalho", emoji: "💼", label: "Limita meu trabalho e minha produtividade" },
      { value: "casa", emoji: "🏠", label: "Até tarefas simples de casa ficaram difíceis" },
    ],
    followUpBadge:
      'Isso não devia ser aceito como normal. Dor que tira você da sua vida não é "só idade" — é um problema com causa e solução.',
  },

  {
    id: "tempo",
    block: 2,
    kind: "single",
    openingBadge:
      "No fim desse diagnóstico você vai descobrir a causa raíz da sua dor e receber um plano personalizado para acabar com ela pra sempre.",
    
    question: "Há quanto tempo você convive com essa dor?",
    options: [
      { value: "menos1m", label: "Menos de 1 mês" },
      { value: "1a3m", label: "1 a 3 meses" },
      { value: "3a6m", label: "3 a 6 meses" },
      { value: "6ma1a", label: "6 meses a 1 ano" },
      { value: "mais1a", label: "Mais de 1 ano" },
      { value: "mais3a", label: "Mais de 3 anos" },
    ],
  },

  {
    id: "tentativas",
    block: 2,
    kind: "multi",
    question: "O que você já tentou pra resolver?",
    subtitle: "Pode marcar mais de uma opção.",
    options: [
      { value: "remedio", emoji: "💊", label: "Medicamentos (anti-inflamatório, analgésico)" },
      { value: "fisio", emoji: "🏥", label: "Fisioterapia presencial" },
      { value: "youtube", emoji: "📺", label: "Alongamentos do YouTube" },
      { value: "injecao", emoji: "💉", label: "Injeções (corticoide, anestésico)" },
      { value: "massagem", emoji: "💆", label: "Massagem / Quiropraxia" },
      { value: "ergonomia", emoji: "🪑", label: "Travesseiro / cadeira ergonômica" },
      { value: "nada", emoji: "🚫", label: "Nunca tentei tratar" },
    ],
  },

  {
    id: "resultado",
    block: 2,
    kind: "single",
    question: "E qual foi o resultado dessas tentativas?",
    options: [
      { value: "temporario", emoji: "😕", label: "Alívio temporário, mas a dor sempre volta" },
      { value: "nenhuma", emoji: "😤", label: "Quase nenhuma melhora" },
      { value: "pouco", emoji: "🤷", label: "Melhorou um pouco, mas nunca resolveu de vez" },
      { value: "nunca", label: "Nunca cheguei a tentar nada" },
    ],
    followUpBadge:
      "Faz todo sentido. A maioria dos tratamentos alivia o sintoma — mas nenhum chega no músculo específico que está causando tudo isso.",
  },

  {
    id: "investimento",
    block: 2,
    kind: "single",
    question:
      "Somando tudo o que você já gastou tentando resolver essa dor (remédios, fisio, consultas), quanto isso já deu?",
    options: [
      {
        value: "menos500",
        label: "Menos de R$ 500",
        followUpBadge: "Todo esse investimento — e a causa raiz ainda não foi tratada.",
      },
      {
        value: "500a2000",
        label: "Entre R$ 500 e R$ 2.000",
        followUpBadge: "Todo esse investimento — e a causa raiz ainda não foi tratada.",
      },
      {
        value: "mais2000",
        label: "Mais de R$ 2.000",
        followUpBadge: "Todo esse investimento — e a causa raiz ainda não foi tratada.",
      },
      { value: "nada", label: "Ainda não investi nada" },
    ],
  },

  {
    id: "atividade",
    block: 2,
    kind: "single",
    question: "Qual é o seu nível de atividade física atual?",
    options: [
      { value: "sedentario", label: "Sedentário(a)", hint: "trabalho sentado, pouca atividade" },
      { value: "leve", label: "Levemente ativo(a)", hint: "caminho 1-2x por semana" },
      { value: "moderado", label: "Moderadamente ativo(a)", hint: "treino 3-4x por semana" },
    ],
  },

  {
    id: "sentado",
    block: 2,
    kind: "single",
    question: "Quantas horas por dia você passa sentado(a)?",
    options: [
      { value: "menos4", label: "Menos de 4h" },
      { value: "4a6", label: "4 a 6h" },
      { value: "6a8", label: "6 a 8h" },
      { value: "mais8", label: "Mais de 8h" },
    ],
    followUpBadge:
      "SOBRE SUA RESPOSTA ANTERIOR:\nSentar por longos períodos aumenta em até 90% a pressão nos discos da sua coluna — o que faz com que seu músculo fique encurtado e enfraquecido puxando sua coluna para o lugar errado.",
  },

  // ── BLOCO 3 — NECESSIDADE, DESEJO E PRIMEIRO SIM ───────────────────────
  {
    id: "sono",
    block: 3,
    kind: "single",
    question: "Como está o seu sono?",
    options: [
      { value: "regular", emoji: "😴", label: "Regular, acordo cansado às vezes" },
      { value: "ruim", emoji: "😩", label: "Ruim — durmo mal e acordo quebrado" },
      { value: "pessimo", emoji: "😵", label: "Péssimo — durmo menos de 5 horas por causa da dor" },
    ],
  },

  {
    id: "sonoImpacto",
    block: 3,
    kind: "single",
    question: "Como o sono ruim tem afetado o seu dia?",
    options: [
      { value: "cansaco", emoji: "😩", label: "Já acordo cansado e de mau humor" },
      { value: "energia", emoji: "😔", label: "Fico sem energia pra trabalhar ou cuidar da casa" },
      { value: "irritado", emoji: "😰", label: "Perco a paciência e fico irritado com facilidade" },
      { value: "tudo", label: "Tudo isso junto" },
    ],
    followUpBadge:
      "O sono é o principal pilar da nossa saúde física e mental. Não vamos deixar isso continuar assim.",
  },

  {
    id: "desejo",
    block: 3,
    kind: "multi",
    question: "Se você acordasse amanhã sem essa dor, o que faria?",
    subtitle: "Pode marcar mais de uma opção.",
    options: [
      { value: "trabalhar", emoji: "✅", label: "Trabalharia o dia todo com foco e sem desconforto" },
      { value: "dormir", emoji: "✅", label: "Dormiria bem a noite toda sem acordar com dor" },
      { value: "netos", emoji: "✅", label: "Brincaria com meus filhos/netos sem medo" },
      { value: "treinar", emoji: "✅", label: "Voltaria a treinar, caminhar ou praticar um esporte" },
      { value: "remedio", emoji: "✅", label: "Pararia de tomar remédios todo dia" },
    ],
  },

  {
    id: "compromisso",
    block: 3,
    kind: "single",
    image: "/src/assets/mecanismo.webp",
    question:
      "Você estaria disposto a dedicar 10 minutos por dia para desencurtar e fortalecer o músculo que está causando sua dor?",
    options: [
      { value: "sim", emoji: "✅", label: "Sim, estou pronto para seguir o plano" },
      { value: "talvez", label: "Não tenho certeza, mas quero tentar" },
    ],
  },

  {
    id: "horario",
    block: 3,
    kind: "single",
    question: "Qual seria o melhor horário pra encaixar seus 10 minutos diários?",
    options: [
      { value: "manha", emoji: "🌅", label: "De manhã, ao acordar" },
      { value: "dia", emoji: "🌆", label: "Durante o dia, numa pausa" },
      { value: "noite", emoji: "🌙", label: "À noite, antes de dormir" },
    ],
    followUpBadge:
      "Perfeito. Vamos te lembrar nesse horário assim que seu plano estiver liberado.",
  },

  // ── BLOCO 4 — MECANISMO, DIAGNÓSTICO E FECHAMENTO ──────────────────────


  {
    id: "mecanismo",
    block: 4,
    kind: "mechanism",
    showAudio: true,
    image: mecanismo2Asset.url,
  },
  { id: "loading", block: 4, kind: "commitment_loading" },
  {
    id: "nome",
    block: 4,
    kind: "name",
    question: "Seu diagnóstico está pronto!  Mas antes, nos diga qual é o seu nome?",
    placeholder: "Digite seu primeiro nome",
    helper:
      "Vamos usar seu nome para personalizar seu diagnóstico e o seu plano de 28 dias.",
  },
  { id: "diagnostico", block: 4, kind: "diagnosis" },
  { id: "vendas", block: 4, kind: "sales" },

] as const;

/** Depoimentos rotativos exibidos na tela de loading (Etapa 21). */
export const TESTIMONIALS = [
  {
    name: "Rodrigo S.",
    initial: "R",
    region: "Ciática",
    text: "Dor puxando da lombar e estendendo pra perna... Tá foda. Comecei o plano meio descrente e na segunda semana já dormia a noite toda.",
  },
  {
    name: "Marlene A.",
    initial: "M",
    region: "Lombar",
    text: "Eu já tinha gastado uma fortuna em fisioterapia. Em 3 semanas de alongamento certo, voltei a varrer a casa sem travar.",
  },
  {
    name: "Cleusa R.",
    initial: "C",
    region: "Hérnia de disco",
    text: "Achei que ia ter que operar. Hoje faço meus 15 minutos de manhã e a dor não me acorda mais de madrugada.",
  },
  {
    name: "Vera L.",
    initial: "V",
    region: "Cervical",
    text: "A dor no pescoço me deixava irritada o dia todo. Agora consigo brincar com meus netos sem medo de travar.",
  },
] as const;
