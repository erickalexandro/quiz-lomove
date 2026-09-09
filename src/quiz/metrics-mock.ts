import { STEPS } from "./steps";

export interface StepMetric {
  stepId: string;
  label: string;
  reached: number;
  abandoned: number;
  abandonRate: number;
  avgTime: number; // in seconds
  isAlert: boolean;
}

export interface FunnelStep {
  name: string;
  value: number;
  percent: number;
}

export interface QuestionDistribution {
  questionId: string;
  question: string;
  options: { label: string; count: number; percent: number }[];
}

export const generateMockMetrics = (device: "all" | "mobile" | "desktop" = "all") => {
  const totalVisitors = device === "all" ? 12842 : device === "mobile" ? 9631 : 3211;
  const completionRate = 0.684;
  
  // Funnel Data
  const funnel: FunnelStep[] = [
    { name: "Quiz Iniciado", value: totalVisitors, percent: 100 },
    { name: "Quiz Concluído", value: Math.round(totalVisitors * 0.72), percent: 72 },
    { name: "Pág. Diagnóstico", value: Math.round(totalVisitors * 0.68), percent: 68 },
    { name: "Clicou CTA Plano", value: Math.round(totalVisitors * 0.25), percent: 25 },
    { name: "Checkout", value: Math.round(totalVisitors * 0.15), percent: 15 },
    { name: "Comprou", value: Math.round(totalVisitors * 0.042), percent: 4.2 },
  ];

  // Step-by-step metrics (22 steps)
  let currentReached = totalVisitors;
  const stepMetrics: StepMetric[] = STEPS.map((step, index) => {
    // Simulate abandonment
    // Higher abandonment at specific steps (like "intensidade" or "audio")
    let baseAbandonRate = 0.02 + Math.random() * 0.03;
    if (step.id === "intensidade") baseAbandonRate = 0.12;
    if (step.id === "audio") baseAbandonRate = 0.08;
    if (step.id === "investimento") baseAbandonRate = 0.15;

    const abandoned = Math.round(currentReached * baseAbandonRate);
    const reached = currentReached;
    const abandonRate = (abandoned / reached) * 100;
    
    // Avg time simulation
    let avgTime = 5 + Math.random() * 10;
    if (step.kind === "audio" || step.kind === "audio_only") avgTime = 45 + Math.random() * 20;
    if (step.kind === "mechanism") avgTime = 30 + Math.random() * 10;

    const metric = {
      stepId: step.id,
      label: `Etapa ${index + 1}: ${step.id}`,
      reached,
      abandoned,
      abandonRate,
      avgTime,
      isAlert: abandonRate > 7, // Threshold for alert
    };

    currentReached -= abandoned;
    return metric;
  });

  // Questions Distribution (Sample)
  const distributions: QuestionDistribution[] = [
    {
      questionId: "idade",
      question: "Qual é a sua idade?",
      options: [
        { label: "40-49", count: Math.round(totalVisitors * 0.35), percent: 35 },
        { label: "50-59", count: Math.round(totalVisitors * 0.45), percent: 45 },
        { label: "60+", count: Math.round(totalVisitors * 0.20), percent: 20 },
      ]
    },
    {
      questionId: "intensidade",
      question: "Qual a intensidade da sua dor?",
      options: [
        { label: "Leve", count: Math.round(totalVisitors * 0.15), percent: 15 },
        { label: "Moderada", count: Math.round(totalVisitors * 0.40), percent: 40 },
        { label: "Intensa", count: Math.round(totalVisitors * 0.35), percent: 35 },
        { label: "Insuportável", count: Math.round(totalVisitors * 0.10), percent: 10 },
      ]
    }
  ];

  return {
    totalVisitors,
    funnel,
    stepMetrics,
    distributions,
    completionRate,
    avgTotalTime: "2:14m"
  };
};
