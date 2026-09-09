/**
 * Tipos centrais do quiz Lomove.
 *
 * A estrutura é orientada a dados: cada etapa é descrita por um objeto e
 * renderizada por um componente de tela correspondente. Isso mantém a copy
 * (fonte da verdade do documento de especificação) separada da apresentação.
 */

/** Regiões de dor — determinam o texto de diagnóstico final (Etapa 22). */
export type PainRegion =
  | "lombar"
  | "ciatica"
  | "cervical"
  | "quadril"
  | "hernia"
  | "outras";

/** Identificador estável de cada etapa (usado como chave das respostas). */
export type StepId =
  | "intro"
  | "idade"
  | "regiao"
  | "genero"
  | "intensidade"
  | "audio"
  | "piora"
  | "impacto"
  | "tempo"
  | "tentativas"
  | "resultado"
  | "investimento"
  | "atividade"
  | "sentado"
  | "sono"
  | "sonoImpacto"
  | "desejo"
  | "compromisso_audio"
  | "altura"
  | "peso"
  | "compromisso"
  | "horario"
  | "nome"
  | "mecanismo"
  | "loading"
  | "diagnostico"
  | "vendas";

export interface Option {
  /** Valor persistido no estado (estável, independente da copy). */
  value: string;
  /** Texto exibido ao usuário. */
  label: string;
  /** Emoji opcional exibido à esquerda do rótulo. */
  emoji?: string;
  /** URL da imagem representativa ilustrada por IA. */
  image?: string;
  /** Texto auxiliar em fonte menor abaixo do rótulo. */
  hint?: string;
  /**
   * Badge de feedback exibido logo após a seleção desta opção.
   * Quando ausente, cai no `badge` da etapa (se houver).
   */
  badge?: string;
  /** Badge exibido no topo da PRÓXIMA tela ("Sobre sua resposta anterior"). */
  followUpBadge?: string;
}

interface BaseStep {
  id: StepId;
  /** Bloco emocional — usado para modular o tom visual da tela. */
  block: 1 | 2 | 3 | 4;
  /** Badge exibido no topo da tela, antes da pergunta. */
  openingBadge?: string;
  /** Badge exibido no topo da PRÓXIMA tela ("Sobre sua resposta anterior"). */
  followUpBadge?: string;
  /** Badge exibido após responder (fallback para opções sem badge próprio). */
  badge?: string;
}

export interface SingleChoiceStep extends BaseStep {
  kind: "single";
  question: string;
  subtitle?: string;
  options: Option[];
  /** URL opcional para imagem de conteúdo. */
  image?: string;
}

export interface MultiChoiceStep extends BaseStep {
  kind: "multi";
  question: string;
  subtitle?: string;
  options: Option[];
}

export interface BodyMapStep extends BaseStep {
  kind: "bodymap";
  question: string;
  subtitle?: string;
  options: Option[];
}

export interface NameStep extends BaseStep {
  kind: "name";
  question: string;
  placeholder: string;
  helper: string;
}

export interface ContentStep extends BaseStep {
  kind: "intro" | "audio" | "audio_only" | "mechanism" | "loading" | "diagnosis" | "commitment_loading" | "sales";
  /** Roteiro do áudio (opcional). Se omitido, a opção de ler o recado não é exibida. */
  script?: string[];
  /** URL opcional para imagem de conteúdo. */
  image?: string;
  /** Exibir áudio do Dr. Elias acima da pergunta/imagem. */
  showAudio?: boolean;
}

export interface NumericStep extends BaseStep {
  kind: "numeric";
  question: string;
  subtitle?: string;
  placeholder: string;
  unit: string;
  min: number;
  max: number;
}


export type Step =
  | SingleChoiceStep
  | MultiChoiceStep
  | BodyMapStep
  | NameStep
  | ContentStep
  | NumericStep;

/** Respostas acumuladas. Escolha única → string; múltipla → string[]. */
export type Answers = Partial<Record<StepId, string | string[]>>;
