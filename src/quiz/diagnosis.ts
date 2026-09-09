import type { Answers, PainRegion } from "./types";

export type CommitmentLevel = "moderado" | "elevado" | "avancado";

export interface Diagnosis {
  /** Nível de comprometimento muscular calculado pelas respostas. */
  level: CommitmentLevel;
  /** Rótulo exibido no medidor. */
  levelLabel: string;
  /** Posição do ponteiro no medidor, de 0 a 100. */
  score: number;
  /** Texto principal do diagnóstico, já personalizado com o nome. */
  text: string;
  /** Nome do músculo/padrão revelado (usado no título). */
  muscle: string;
  region: PainRegion;
}

/** Pesos simples e explícitos por resposta — fáceis de auditar e ajustar. */
const WEIGHTS: Record<string, Record<string, number>> = {
  intensidade: { leve: 8, moderada: 20, intensa: 30 },
  tempo: { menos1m: 3, "1a3m": 8, "3a6m": 13, "6ma1a": 18, mais1a: 24, mais3a: 30 },
  sono: { regular: 6, ruim: 16, pessimo: 22 },
  sentado: { menos4: 3, "4a6": 8, "6a8": 13, mais8: 18 },
};

function scoreFor(answers: Answers): number {
  let total = 0;
  for (const [key, table] of Object.entries(WEIGHTS)) {
    const value = answers[key as keyof Answers];
    if (typeof value === "string" && table[value] !== undefined) {
      total += table[value];
    }
  }
  // Normaliza para uma faixa visualmente útil no medidor.
  // Padrão solicitado: mais grave de acordo com as respostas, mas nunca 100% (irreversível).
  return Math.min(94, Math.max(72, total));
}

function levelFor(score: number): { level: CommitmentLevel; levelLabel: string } {
  if (score < 50) return { level: "moderado", levelLabel: "MODERADO" };
  if (score < 75) return { level: "elevado", levelLabel: "ELEVADO" };
  return { level: "avancado", levelLabel: "AVANÇADO" };
}

function textFor(region: PainRegion, name: string): { text: string; muscle: string } {
  switch (region) {
    case "lombar":
      return {
        muscle: "Iliopsoas",
        text: `${name}, com base nas suas respostas, identifiquei que o músculo que provavelmente está causando a sua dor é o Iliopsoas — um músculo profundo que conecta sua coluna ao quadril. Quando ele encurta, puxa a sua coluna e gera pressão constante na região lombar. A boa notícia é que esse músculo responde bem a alongamentos específicos. Com o plano certo, em 28 dias você estará sem dor alguma.`,
      };
    case "ciatica":
      return {
        muscle: "Compressão do nervo ciático",
        text: `${name}, com base nas suas respostas, identifiquei que a causa mais provável da sua dor ciática é a compressão do nervo ciático na região do quadril e dos glúteos, principalmente por músculos encurtados ao redor dele. A boa notícia é que essa compressão costuma responder muito bem a alongamentos específicos e progressivos. Com o plano certo, em 28 dias você pode reduzir drasticamente a dor.`,
      };
    case "hernia":
      return {
        muscle: "Desequilíbrio de estabilizadores da coluna",
        text: `${name}, com base nas suas respostas, identifiquei que os músculos que deveriam proteger a sua coluna estão enfraquecidos e em desequilíbrio. Isso faz com que a região dolorida receba mais carga do que deveria. A boa notícia é que esses músculos respondem muito bem a exercícios específicos de fortalecimento e alongamento.`,
      };
    default:
      // Fallback genérico (Cervical, Quadril/glúteos e Outras).
      return {
        muscle: "Padrão de encurtamento muscular",
        text: `${name}, com base nas suas respostas, identifiquei um padrão de encurtamento e enfraquecimento nos músculos que sustentam a sua coluna nessa região. Quando esses músculos ficam curtos, eles puxam as estruturas ao redor pro lugar errado e geram pressão constante — e é essa pressão que vira dor todos os dias. A boa notícia é que esse padrão responde muito bem a alongamentos específicos e progressivos. Com o plano certo, em 28 dias você pode reduzir drasticamente a sua dor.`,
      };
  }
}

/** Monta o diagnóstico final a partir das respostas coletadas. */
export function buildDiagnosis(answers: Answers): Diagnosis {
  const region = (answers.regiao as PainRegion) ?? "lombar";
  const rawName = typeof answers.nome === "string" ? answers.nome.trim() : "";
  const name = rawName.length > 0 ? rawName : "Olá";
  const score = scoreFor(answers);
  const { level, levelLabel } = levelFor(score);
  const { text, muscle } = textFor(region, name);
  return { level, levelLabel, score, text, muscle, region };
}

/** Primeiro nome informado, com fallback neutro para uso na copy. */
export function firstName(answers: Answers): string {
  const raw = typeof answers.nome === "string" ? answers.nome.trim() : "";
  return raw.length > 0 ? raw : "";
}
