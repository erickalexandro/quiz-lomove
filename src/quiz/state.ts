import { useCallback, useEffect, useReducer } from "react";
import { STEPS } from "./steps";
import type { Answers, StepId } from "./types";

const STORAGE_KEY = "lomove-quiz-v1";

export interface QuizState {
  /** Índice da etapa atual dentro de STEPS. */
  index: number;
  answers: Answers;
}

type Action =
  | { type: "answer"; id: StepId; value: string | string[] }
  | { type: "next" }
  | { type: "back" }
  | { type: "jump"; index: number }
  | { type: "reset" };

const initialState: QuizState = { index: 0, answers: {} };

function reducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "answer":
      return { ...state, answers: { ...state.answers, [action.id]: action.value } };
    case "next":
      return { ...state, index: Math.min(state.index + 1, STEPS.length - 1) };
    case "back":
      return { ...state, index: Math.max(state.index - 1, 0) };
    case "jump": {
      const targetIndex = Math.max(0, Math.min(action.index, STEPS.length - 1));
      const newAnswers = { ...state.answers };
      // Preencher respostas padrão para as etapas anteriores para evitar quebras de lógica
      for (let i = 0; i < targetIndex; i++) {
        const step = STEPS[i];
        if (step && !newAnswers[step.id]) {
          if (step.kind === "single") {
            const options = (step as any).options;
            newAnswers[step.id] = options?.[0]?.value || "";
          } else if (step.kind === "multi") {
            const options = (step as any).options;
            newAnswers[step.id] = options?.[0] ? [options[0].value] : [];
          } else if (step.kind === "name") {
            newAnswers[step.id] = "Visitante (Admin)";
          }
        }
      }
      return { ...state, index: targetIndex, answers: newAnswers };
    }
    case "reset":
      return initialState;
    default:
      return state;
  }
}

/**
 * Hook de estado do quiz.
 */
export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restauração de progresso (desativada para evitar fricção no fluxo normal)
  useEffect(() => {
    // Apenas restaurar se houver um marcador explícito ou se quisermos manter a persistência
    // Por enquanto, desativado para garantir que o quiz comece do zero sem fricção.
  }, []);

  // Salva o progresso a cada mudança (apenas para diagnóstico final)
  useEffect(() => {
    try {
      if (state.index >= STEPS.findIndex(s => s.id === 'diagnostico')) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      // Ignorado
    }
  }, [state]);

  const answer = useCallback(
    (id: StepId, value: string | string[]) => dispatch({ type: "answer", id, value }),
    [],
  );
  
  const next = useCallback(() => dispatch({ type: "next" }), []);
  const back = useCallback(() => dispatch({ type: "back" }), []);
  const jump = useCallback((index: number) => dispatch({ type: "jump", index }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const step = STEPS[state.index]!;
  const answers = state.answers;

  return { state, step, answer, next, back, jump, reset, answers };
}

/** Percentual de progresso (1 a 100) exibido na barra. */
export function progressPercent(index: number): number {
  if (index === 0) return 0;
  return Math.round(((index + 1) / STEPS.length) * 100);
}
