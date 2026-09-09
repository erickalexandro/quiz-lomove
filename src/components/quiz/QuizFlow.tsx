import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProgressHeader, StepShell } from "@/components/quiz/QuizChrome";
import {
  BodyMapScreen,
  MultiChoiceScreen,
  SingleChoiceScreen,
} from "@/components/quiz/screens/ChoiceScreens";
import {
  AudioScreen,
  AudioOnlyScreen,
  LoadingScreen,
  CommitmentLoadingScreen,
  MechanismScreen,
  NameScreen,
  NumericScreen,
} from "@/components/quiz/screens/ContentScreens";
import { DiagnosisScreen } from "@/components/quiz/screens/DiagnosisScreen";
import { SalesPage } from "@/components/quiz/screens/SalesPage";
import { buildDiagnosis, firstName } from "@/quiz/diagnosis";
import { STEPS } from "@/quiz/steps";
import type { SingleChoiceStep } from "@/quiz/types";
import { progressPercent, useQuiz } from "@/quiz/state";

/**
 * Controlador do quiz: mantém uma única pergunta por tela, barra de progresso
 * sempre visível e um botão de voltar discreto.
 */
export function QuizFlow() {
  const { state, step, answer, next, back, answers } = useQuiz();
  const [mounted, setMounted] = useState(false);

  // Rola para o topo a cada troca de etapa (evita começar a tela no meio).
  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.index]);

  const prevStep = state.index > 0 ? STEPS[state.index - 1] : null;
  const prevAnswer = prevStep ? state.answers[prevStep.id] : null;
  
  // Calcula o badge de follow-up baseado na resposta anterior
  const prevAnswerBadge = useMemo(() => {
    if (state.index === 0) return null;
    
    const prevStep = STEPS[state.index - 1];
    if (!prevStep) return null;
    
    const prevAnswer = state.answers[prevStep.id];
    if (!prevAnswer) return null;
    
    // Se o passo anterior for de escolha única
    if (prevStep.kind === "single" && typeof prevAnswer === "string") {
      const option = prevStep.options.find(o => o.value === prevAnswer);
      return option?.followUpBadge || prevStep.followUpBadge || null;
    }
    
    // Se o passo anterior for de múltipla escolha
    if (prevStep.kind === "multi" && Array.isArray(prevAnswer) && prevAnswer.length > 0) {
      return prevStep.followUpBadge || null;
    }
    
    return null;
  }, [state.index, state.answers]);

  const name = firstName(state.answers);
  const diagnosis = useMemo(() => buildDiagnosis(state.answers), [state.answers]);

  const percent = state.index === 0 ? 0 : progressPercent(state.index);
  const showChrome = step.kind !== "loading";

  const content = () => {
    switch (step.kind) {
      case "intro": {
        const nextStep = STEPS.find(s => s.id === "idade") as SingleChoiceStep | undefined;
        return (
          <SingleChoiceScreen
            step={STEPS[0] as any}
            value={undefined}
            onAnswer={() => {}}
            onNext={next}
            isFirstStep={true}
            mergedQuestion={nextStep?.question}
            mergedOptions={nextStep?.options}
          />
        );
      }
      case "single":
        return (
          <>
            {/* CommitmentIntro removido daqui e transformado em audio_only na etapa anterior */}
            <SingleChoiceScreen
              step={step}
              value={state.answers[step.id] as string | undefined}
              prevAnswerBadge={prevAnswerBadge}
              onAnswer={(value) => answer(step.id, value)}
              onNext={next}
              isFirstStep={state.index === 0}
            />
          </>
        );
      case "multi":
        return (
          <MultiChoiceScreen
            step={step}
            value={state.answers[step.id] as string[] | undefined}
            prevAnswerBadge={prevAnswerBadge}
            onAnswer={(value) => answer(step.id, value)}
            onNext={next}
            showBodyMap={step.id === "regiao"}
          />
        );
      case "bodymap":
        return null; // Removido em favor de alternativas com imagens IA na etapa 'regiao'
      case "audio":
        return <AudioScreen step={step} onNext={next} prevAnswerBadge={prevAnswerBadge} answers={answers} />;
      case "audio_only":
        return <AudioOnlyScreen step={step} onNext={next} />;
      case "name":
        return (
          <NameScreen
            step={step}
            value={state.answers[step.id] as string | undefined}
            onAnswer={(value) => answer(step.id, value)}
            onNext={next}
          />
        );
      case "numeric":
        return (
          <NumericScreen
            step={step}
            value={state.answers[step.id] as string | undefined}
            onAnswer={(value) => answer(step.id, value)}
            onNext={next}
          />
        );
      case "mechanism":
        return <MechanismScreen step={step} name={name} onNext={next} />;
      case "commitment_loading":
        return <CommitmentLoadingScreen name={name} onDone={next} />;
      case "loading":
        return <LoadingScreen name={name} onDone={next} />;
      case "diagnosis":
        return (
          <DiagnosisScreen
            diagnosis={diagnosis}
            name={name}
            answers={state.answers}
            onAccept={() => {
              console.log("QuizFlow: onAccept triggered, calling next()");
              next();
            }}

            onDoubts={() =>
              toast("Tudo bem, é normal ter dúvidas.", {
                description:
                  "O Dr. Elias explica cada etapa do plano antes de você decidir qualquer coisa.",
              })
            }
          />
        );
      case "sales":
        return <SalesPage name={name} diagnosis={diagnosis} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {showChrome ? (
        <ProgressHeader
          percent={percent}
          stepLabel={`${state.index + 1}/${STEPS.length}`}
          canGoBack={mounted && state.index > 0 && step.kind !== "diagnosis"}
          onBack={back}
        />
      ) : null}

      <StepShell stepKey={step.id}>{content()}</StepShell>
    </div>
  );
}
